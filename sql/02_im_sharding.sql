-- =============================================================================
--  IM 即时聊天系统（ChatFlow）— 生产分片建库建表脚本
-- -----------------------------------------------------------------------------
--  文件     : 02_im_sharding.sql
--  版本     : V1.0
--  日期     : 2026-10-01
--  对应文档 : 《IM数据库表结构设计文档》V1.0 第 4 章、第 20.2 章
--  前置条件 : 必须先执行 01_im_schema.sql（本脚本用 CREATE TABLE ... LIKE
--             从 chatflow_dev 的同名表克隆结构）
--  目标库   : MySQL 8.0+
-- -----------------------------------------------------------------------------
--  ⚠️ 执行提示
--  1) 本脚本用于【生产/压测环境】预置分片表，执行耗时较长（数万张表）。
--     开发环境请只用 01_im_schema.sql，不要执行本脚本。
--  2) 需要 CREATE DATABASE / CREATE ROUTINE 权限。
--  3) 分片数与路由公式一经上线即冻结（架构文档 11.1 第 5 条：数据分片键设计
--     必须在首期确定，后期不可变更）。
--  4) 本脚本包含对设计文档的【偏差 C】修正，见文件末尾说明。
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';


-- =============================================================================
-- 一、分片键与路由公式
-- =============================================================================
--
--  【消息域】分片键 = conv_id，共 16 库 x 256 表 = 4096 张
--      h          = hash(conv_id) % 4096
--      dbIndex    = h / 256          -> im_message_db_00 .. im_message_db_15
--      tableIndex = h % 256          -> im_message_000 .. im_message_255
--
--  【会话域】分片键 = user_id，共 8 库 x 64 表 = 512 张
--      h          = hash(user_id) % 512
--      dbIndex    = h / 64           -> im_conv_db_0 .. im_conv_db_7
--      tableIndex = h % 64           -> *_000 .. *_063
--
--  【⚠️ 对文档公式的修正】
--      设计文档原文（架构文档 16.2 / 数据库文档 4.1）为：
--          dbIndex = hash(key) % 16      tableIndex = hash(key) % 256
--      该写法下，对任意 key 都有 tableIndex % 16 == dbIndex，
--      即 16 x 256 = 4096 个 (库,表) 组合中只有 256 个会被真正使用，
--      其余 3840 张表建了也永远不会有数据 —— 相当于只实现了 1/16 的容量。
--      本脚本采用"先取总槽位、再拆分库与表"的正确写法（见上方公式），
--      使 4096 张表全部承载数据。
--
--  【哈希函数约定】
--      生产建议使用稳定哈希（如 MurmurHash3 / xxHash64），
--      禁止使用 Java String.hashCode（分布不均且跨语言不一致）；
--      ShardingSphere 侧使用 INLINE 表达式时由其内部实现决定，
--      应用侧计算与 ShardingSphere 必须保持同一函数，否则路由错位。
-- =============================================================================


-- =============================================================================
-- 二、通用分片表生成存储过程
-- =============================================================================

DROP PROCEDURE IF EXISTS gen_shards;

DELIMITER $$

CREATE PROCEDURE gen_shards(
    IN p_db_prefix VARCHAR(64),   -- 逻辑库前缀，如 im_message_db_
    IN p_db_count  INT,           -- 库数量
    IN p_tbl_count INT,           -- 每库表数量
    IN p_base_db   VARCHAR(64),   -- 模板表所在库，如 chatflow_dev
    IN p_base_tbl  VARCHAR(64),   -- 模板表名，如 im_message
    IN p_tbl_pad   INT            -- 表序号补零位数，如 3 -> 000
)
BEGIN
    DECLARE v_db_idx  INT DEFAULT 0;
    DECLARE v_tbl_idx INT DEFAULT 0;
    DECLARE v_db_name  VARCHAR(64);
    DECLARE v_tbl_name VARCHAR(64);

    WHILE v_db_idx < p_db_count DO

        -- 建库
        SET v_db_name = CONCAT(p_db_prefix, LPAD(v_db_idx, 2, '0'));
        SET @ddl = CONCAT('CREATE DATABASE IF NOT EXISTS `', v_db_name,
                          '` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci');
        PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

        -- 建表（从模板表克隆结构，含索引与注释）
        SET v_tbl_idx = 0;
        WHILE v_tbl_idx < p_tbl_count DO
            SET v_tbl_name = CONCAT(p_base_tbl, '_', LPAD(v_tbl_idx, p_tbl_pad, '0'));
            SET @ddl = CONCAT('CREATE TABLE IF NOT EXISTS `', v_db_name, '`.`', v_tbl_name,
                              '` LIKE `', p_base_db, '`.`', p_base_tbl, '`');
            PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
            SET v_tbl_idx = v_tbl_idx + 1;
        END WHILE;

        SET v_db_idx = v_db_idx + 1;
    END WHILE;
END$$

DELIMITER ;


-- =============================================================================
-- 三、生成消息域分片表（分片键 conv_id，16 库 x 256 表）
-- =============================================================================

-- 3.1 消息主表：16 x 256 = 4096 张
CALL gen_shards('im_message_db_', 16, 256, 'chatflow_dev', 'im_message', 3);

-- 3.2 消息附件关系表：与消息同分片（同 conv_id），保证正文与附件同库
CALL gen_shards('im_message_db_', 16, 256, 'chatflow_dev', 'im_message_attachment', 3);

-- 3.3 消息回执表：按 conv_id 分片（仅单聊使用）
CALL gen_shards('im_message_db_', 16, 256, 'chatflow_dev', 'im_message_receipt', 3);


-- =============================================================================
-- 四、生成会话域分片表（分片键 user_id，8 库 x 64 表）
-- =============================================================================

-- 4.1 会话成员表：8 x 64 = 512 张
CALL gen_shards('im_conv_db_', 8, 64, 'chatflow_dev', 'im_conversation_member', 3);

-- 4.2 已读水位表：8 x 64
CALL gen_shards('im_conv_db_', 8, 64, 'chatflow_dev', 'im_read_watermark', 3);

-- 4.3 会话草稿表：8 x 64
CALL gen_shards('im_conv_db_', 8, 64, 'chatflow_dev', 'im_conversation_draft', 3);


-- =============================================================================
-- 五、生成会话实体表分片（分片键 conv_id，与消息域同规则）
-- =============================================================================
-- 【偏差 C】im_conversation 的分片键
--   设计文档将 im_conversation 与 im_conversation_member / im_read_watermark /
--   im_conversation_draft 一起归入"按 user_id 分片"（数据库文档 4.1）。
--   问题：im_conversation 是"每会话一行"的实体表，而单聊 conv_id 由双方
--         uid 哈希生成。若按 user_id 分片，同一个单聊会话在 A 的视角与
--         B 的视角会落到不同分片，无法确定"该去哪个分片读会话行"。
--   处理：im_conversation 改为按 conv_id 分片（与消息一致）；
--         仅"每用户一行"的 member / watermark / draft 保持按 user_id 分片。
--   理由：查询条件决定分片键 —— 会话实体永远以 conv_id 查询。
-- =============================================================================

CALL gen_shards('im_message_db_', 16, 256, 'chatflow_dev', 'im_conversation', 3);


-- =============================================================================
-- 六、生成同步日志分片表（分片键 user_id，8 库 x 64 表）
-- =============================================================================
-- 注意：im_sync_log 在 01 脚本中已带按天 RANGE 分区 + pmax 分区。
--       CREATE TABLE ... LIKE 不会复制分区定义，需在建表后单独补分区。
--       本脚本先用 gen_shards 建结构，再调用 add_daily_partition 逐日补分区。
-- =============================================================================

CALL gen_shards('im_sync_db_', 8, 64, 'chatflow_dev', 'im_sync_log', 3);


-- =============================================================================
-- 七、分区滚动维护（im_sync_log / im_audit_log）
-- =============================================================================
--
--  设计目标：sync_log 保留 7 天，audit_log 保留 >= 180 天。
--  维护方式：按天/按月 RANGE 分区 + DROP PARTITION 秒级清理，
--           禁止 DELETE FROM ... WHERE created_at < ?（会造成主从延迟与
--           binlog 膨胀）。
--  由 chatflow-job 的 SyncLogCleanJob / AuditArchiveJob 调用。
-- =============================================================================

-- 7.1 追加下一个分区（把 pmax 拆分出一个具体分区）
DROP PROCEDURE IF EXISTS add_daily_partition;

DELIMITER $$

CREATE PROCEDURE add_daily_partition(
    IN p_table VARCHAR(128),   -- 表名，如 im_sync_db_00.im_sync_log_000
    IN p_date  DATE            -- 该分区覆盖的日期
)
BEGIN
    SET @ddl = CONCAT(
        'ALTER TABLE `', p_table, '` REORGANIZE PARTITION pmax INTO (',
        'PARTITION p', DATE_FORMAT(p_date, '%Y%m%d'),
        ' VALUES LESS THAN (TO_DAYS(''', DATE_ADD(p_date, INTERVAL 1 DAY), ''')), ',
        'PARTITION pmax VALUES LESS THAN MAXVALUE)'
    );
    PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- 7.2 使用示例：为所有 sync_log 分片补出 2026-10-02 这一天的分区
--     （实际由 SyncLogCleanJob 每日自动调用）
-- CALL add_daily_partition('im_sync_db_00.im_sync_log_000', '2026-10-02');

-- 7.3 清理过期分区（保留 7 天）
-- ALTER TABLE im_sync_db_00.im_sync_log_000 DROP PARTITION p20261001;

-- 7.4 查看分区情况
-- SELECT TABLE_SCHEMA, TABLE_NAME, PARTITION_NAME, PARTITION_DESCRIPTION
--   FROM information_schema.PARTITIONS
--  WHERE TABLE_NAME LIKE 'im_sync_log%'
--    AND PARTITION_NAME IS NOT NULL
--  ORDER BY TABLE_SCHEMA, TABLE_NAME, PARTITION_ORDINAL_POSITION;


-- =============================================================================
-- 八、冷热分层归档
-- =============================================================================
--
--  热数据（0-90 天）  : 在线库，读写 P95 < 50ms
--  温数据（90-365 天）: 普通存储，按需查询
--  冷数据（> 365 天） : 对象存储归档 + 压缩，检索异步化
--
--  由 DataArchiveJob 执行，迁移对业务无感（架构文档 16.2 规约第 3 条）。
-- =============================================================================

-- 8.1 归档表结构（冷库，与热表同构，去掉唯一约束以降低写入成本）
-- CREATE TABLE IF NOT EXISTS im_archive_db.im_message_2026q3 LIKE chatflow_dev.im_message;

-- 8.2 按分片表整体迁移（示例：迁移 conv_id 落在 0 号库的 90 天前数据）
-- INSERT INTO im_archive_db.im_message_2026q3
-- SELECT * FROM im_message_db_00.im_message_000
--  WHERE created_at < DATE_SUB(NOW(3), INTERVAL 90 DAY);

-- 8.3 确认迁移完成后清理源数据（分片表可整体 DROP 后重建，成本最低）
-- DELETE FROM im_message_db_00.im_message_000
--  WHERE created_at < DATE_SUB(NOW(3), INTERVAL 90 DAY)
--  LIMIT 5000;   -- 分批执行，避免大事务


-- =============================================================================
-- 九、ShardingSphere 分片配置
-- =============================================================================
--
--  与上方路由公式必须完全一致（同一哈希函数、同一取模方式），
--  否则应用侧计算与中间件路由会错位。
--
--  rules:
--    - !SHARDING
--      tables:
--        im_message:
--          actualDataNodes: ds_message_${0..15}.im_message_${0..255}
--          databaseStrategy:
--            standard:
--              shardingColumn: conv_id
--              shardingAlgorithmName: message_db
--          tableStrategy:
--            standard:
--              shardingColumn: conv_id
--              shardingAlgorithmName: message_tbl
--
--        im_message_attachment:
--          actualDataNodes: ds_message_${0..15}.im_message_attachment_${0..255}
--          databaseStrategy:
--            standard: { shardingColumn: conv_id, shardingAlgorithmName: message_db }
--          tableStrategy:
--            standard: { shardingColumn: conv_id, shardingAlgorithmName: attachment_tbl }
--
--        im_conversation:
--          actualDataNodes: ds_message_${0..15}.im_conversation_${0..255}
--          databaseStrategy:
--            standard: { shardingColumn: conv_id, shardingAlgorithmName: message_db }
--          tableStrategy:
--            standard: { shardingColumn: conv_id, shardingAlgorithmName: conv_tbl }
--
--        im_conversation_member:
--          actualDataNodes: ds_conv_${0..7}.im_conversation_member_${0..63}
--          databaseStrategy:
--            standard: { shardingColumn: user_id, shardingAlgorithmName: conv_db }
--          tableStrategy:
--            standard: { shardingColumn: user_id, shardingAlgorithmName: member_tbl }
--
--        im_read_watermark:
--          actualDataNodes: ds_conv_${0..7}.im_read_watermark_${0..63}
--          databaseStrategy:
--            standard: { shardingColumn: user_id, shardingAlgorithmName: conv_db }
--          tableStrategy:
--            standard: { shardingColumn: user_id, shardingAlgorithmName: watermark_tbl }
--
--        im_sync_log:
--          actualDataNodes: ds_sync_${0..7}.im_sync_log_${0..63}
--          databaseStrategy:
--            standard: { shardingColumn: user_id, shardingAlgorithmName: conv_db }
--          tableStrategy:
--            standard: { shardingColumn: user_id, shardingAlgorithmName: synclog_tbl }
--
--      shardingAlgorithms:
--        message_db:
--          type: INLINE
--          props:
--            algorithm-expression: ds_message_${(conv_id.hashCode() & 4095) / 256}
--        message_tbl:
--          type: INLINE
--          props:
--            algorithm-expression: im_message_${(conv_id.hashCode() & 4095) % 256}
--        attachment_tbl:
--          type: INLINE
--          props:
--            algorithm-expression: im_message_attachment_${(conv_id.hashCode() & 4095) % 256}
--        conv_tbl:
--          type: INLINE
--          props:
--            algorithm-expression: im_conversation_${(conv_id.hashCode() & 4095) % 256}
--        conv_db:
--          type: INLINE
--          props:
--            algorithm-expression: ds_conv_${(user_id.hashCode() & 511) / 64}
--        member_tbl:
--          type: INLINE
--          props:
--            algorithm-expression: im_conversation_member_${(user_id.hashCode() & 511) % 64}
--        watermark_tbl:
--          type: INLINE
--          props:
--            algorithm-expression: im_read_watermark_${(user_id.hashCode() & 511) % 64}
--        synclog_tbl:
--          type: INLINE
--          props:
--            algorithm-expression: im_sync_log_${(user_id.hashCode() & 511) % 64}
--
--  注意：
--   1) 上例用 hashCode 仅为示意，生产请替换为统一的稳定哈希实现
--      （如 MurmurHash3），并保证应用侧与中间件使用同一函数。
--   2) 禁止在分片表上执行不带分片键的查询，ShardingSphere 配置为强制校验。
--   3) 扩容采用一致性哈希 + 双写迁移工具，支持在线重分布
--      （数据迁移期间双读双写比对，架构文档 16.2）。


-- =============================================================================
-- 十、执行结果自检
-- =============================================================================

-- 10.1 分片库清单
SELECT SCHEMA_NAME
  FROM information_schema.SCHEMATA
 WHERE SCHEMA_NAME LIKE 'im\_message\_db\_%'
    OR SCHEMA_NAME LIKE 'im\_conv\_db\_%'
    OR SCHEMA_NAME LIKE 'im\_sync\_db\_%'
 ORDER BY SCHEMA_NAME;

-- 10.2 各分片库表数量统计
SELECT TABLE_SCHEMA,
       COUNT(*) AS table_count
  FROM information_schema.TABLES
 WHERE TABLE_SCHEMA LIKE 'im\_message\_db\_%'
    OR TABLE_SCHEMA LIKE 'im\_conv\_db\_%'
    OR TABLE_SCHEMA LIKE 'im\_sync\_db\_%'
 GROUP BY TABLE_SCHEMA
 ORDER BY TABLE_SCHEMA;

-- 预期：
--   im_message_db_00 ~ im_message_db_15 : 每库 256(消息) + 256(附件) + 256(回执) + 256(会话) = 1024
--   im_conv_db_0  ~ im_conv_db_7        : 每库 64 x 3 = 192
--   im_sync_db_0  ~ im_sync_db_7        : 每库 64


-- =============================================================================
-- 偏差说明（建议同步修订《IM数据库表结构设计文档》）
-- =============================================================================
-- 【偏差 C】im_conversation 分片键由 user_id 改为 conv_id
--   文档原文：会话域（im_conversation / im_conversation_member /
--             im_read_watermark / im_conversation_draft）统一按 user_id 分片
--   问题：im_conversation 是"每会话一行"的实体表；单聊 conv_id 由双方 uid
--         哈希生成，按 user_id 分片会导致同一会话在 A/B 两个视角落到不同分片，
--         无法确定读取目标分片。
--   处理：im_conversation 按 conv_id 分片（与消息域一致）；
--         仅"每用户一行"的 member / watermark / draft 保持按 user_id 分片。
--   原则：分片键由"查询条件"决定 —— 会话实体永远以 conv_id 查询。
--
-- 【偏差 D】分片路由公式修正（本文件第一章）
--   文档原文 dbIndex = hash % 16、tableIndex = hash % 256，
--   导致 4096 个 (库,表) 组合中仅 256 个被使用。
--   修正为：h = hash % 4096；dbIndex = h / 256；tableIndex = h % 256。
-- =============================================================================

-- 清理临时存储过程（保留 add_daily_partition 供 Job 调用）
-- DROP PROCEDURE IF EXISTS gen_shards;

-- — 文件结束 —
