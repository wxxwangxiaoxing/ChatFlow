-- =============================================================================
--  IM 即时聊天系统（ChatFlow）— 数据库建表脚本
-- -----------------------------------------------------------------------------
--  文件     : 01_im_schema.sql
--  版本     : V1.0
--  日期     : 2026-10-01
--  对应文档 : 《IM数据库表结构设计文档》V1.0
--  目标库   : MySQL 8.0+ （InnoDB / utf8mb4）
--  表数量   : 26 张
-- -----------------------------------------------------------------------------
--  说明
--  1) 本文件为【开发期单库形态】，对应设计文档第 20.1 章"渐进式分片"阶段一。
--     26 张表全部建在同一个库中，逻辑库归属以注释标注，业务代码不感知分片。
--  2) 生产分片形态（16 库 x 256 表等）见 02_im_sharding.sql。
--  3) 初始化数据（系统配置、内置机器人）见 03_im_init_data.sql。
--  4) 时间字段统一 DATETIME(3)，存 UTC；连接会话已设置 time_zone = '+00:00'。
--  5) 所有表使用 CREATE TABLE IF NOT EXISTS，重复执行安全。
-- -----------------------------------------------------------------------------
--  与设计文档的两处必要偏差（DDL 落地时暴露，详见文件末尾"偏差说明"）
--  A) im_message 不按月分区
--  B) im_sync_log / im_audit_log 的主键与唯一索引调整
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS chatflow_dev
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE chatflow_dev;


-- =============================================================================
-- 一、账号与设备                                 【逻辑库：account_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_user 用户表
-- 对应 PRD 5.2 个人资料（REL-001）、5.1 账号状态（ACC-010）
-- 注意：phone 要求加密存储 + 脱敏展示（PRD 8.2）。
--       若采用随机化加密（如 AES-GCM），需另加 phone_hash 列建唯一索引；
--       此处按确定性加密处理，直接在 phone 上建唯一索引。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_user (
    id                      BIGINT       NOT NULL COMMENT '用户ID（雪花）',
    username                VARCHAR(64)  NOT NULL COMMENT '账号',
    nickname                VARCHAR(64)  NOT NULL COMMENT '昵称',
    avatar_url              VARCHAR(512) DEFAULT NULL COMMENT '头像URL',
    phone                   VARCHAR(32)  DEFAULT NULL COMMENT '手机号（加密存储）',
    email                   VARCHAR(128) DEFAULT NULL COMMENT '邮箱',
    employee_no             VARCHAR(64)  DEFAULT NULL COMMENT '工号',

    signature               VARCHAR(255) DEFAULT NULL COMMENT '个性签名',
    job_title               VARCHAR(128) DEFAULT NULL COMMENT '职位',

    password_hash           VARCHAR(255) DEFAULT NULL COMMENT '密码Hash（bcrypt/argon2）',

    status                  TINYINT      NOT NULL DEFAULT 1
                            COMMENT '1正常 2冻结 3禁用 4注销',

    phone_visible           TINYINT      NOT NULL DEFAULT 1 COMMENT '手机号是否可见 0否 1是',
    external_search_enabled TINYINT      NOT NULL DEFAULT 1 COMMENT '是否允许组织外搜索到 0否 1是',

    last_login_at           DATETIME(3)  DEFAULT NULL COMMENT '最近登录时间',
    last_online_at          DATETIME(3)  DEFAULT NULL COMMENT '最近在线时间（异步批量写）',

    created_at              DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at              DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_phone (phone),
    UNIQUE KEY uk_employee_no (employee_no),
    KEY idx_status (status),
    KEY idx_last_online (last_online_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='用户表';


-- -----------------------------------------------------------------------------
-- im_user_device 设备表
-- 对应 PRD ACC-006 多端登录管理、ACC-007 会话保持与踢出
-- 注意：实时连接状态不放本表，连接态与路由在 Redis（presence / route，TTL 90s）
--       push_token 不在此表，统一归口 im_push_device
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_user_device (
    id              BIGINT       NOT NULL COMMENT '主键（雪花）',
    user_id         BIGINT       NOT NULL COMMENT '用户ID',

    device_id       VARCHAR(128) NOT NULL COMMENT '设备标识（端上生成，重装即变）',
    device_type     VARCHAR(32)  NOT NULL COMMENT '设备类型 ios/android/windows/macos/web',
    device_name     VARCHAR(128) DEFAULT NULL COMMENT '设备名称',

    client_version  VARCHAR(32)  DEFAULT NULL COMMENT '客户端版本',

    last_login_at   DATETIME(3)  DEFAULT NULL COMMENT '最近登录时间',
    last_active_at  DATETIME(3)  DEFAULT NULL COMMENT '最近活跃时间',

    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '1正常 2已踢下线 3设备黑名单',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),
    UNIQUE KEY uk_user_device (user_id, device_id),
    KEY idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='用户设备表';


-- =============================================================================
-- 二、组织架构                                   【逻辑库：account_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_department 部门表
-- 数据由 HR/OA 事件驱动同步，本系统不提供部门写入口
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_department (
    id              BIGINT       NOT NULL COMMENT '部门ID（雪花）',
    parent_id       BIGINT       NOT NULL DEFAULT 0 COMMENT '父部门ID，根部门为0',

    name            VARCHAR(128) NOT NULL COMMENT '部门名称',
    path            VARCHAR(512) DEFAULT NULL COMMENT '物化路径，如 /1/12/135/，便于子树查询',

    sort_no         INT          NOT NULL DEFAULT 0 COMMENT '排序号',

    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '1正常 2已停用',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),
    KEY idx_parent (parent_id),
    KEY idx_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='部门表';


-- -----------------------------------------------------------------------------
-- im_user_department 用户部门关系表
-- 支持一人多部门（PRD REL-007 通讯录按部门树展示）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_user_department (
    user_id         BIGINT      NOT NULL COMMENT '用户ID',
    department_id   BIGINT      NOT NULL COMMENT '部门ID',

    is_primary      TINYINT     NOT NULL DEFAULT 1 COMMENT '1主部门 0兼职部门',
    created_at      DATETIME(3) NOT NULL COMMENT '创建时间(UTC)',

    PRIMARY KEY (user_id, department_id),
    KEY idx_department (department_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='用户部门关系表';


-- =============================================================================
-- 三、关系链                                     【逻辑库：relation_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_friend 好友表
-- 双向各存一条：A->B 与 B->A 独立，因双方备注、标签、状态可能不同（PRD REL-004）
-- 高频读，Redis Set friend:{userId} 缓存，MySQL 为准
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_friend (
    user_id         BIGINT      NOT NULL COMMENT '用户ID',
    friend_id       BIGINT      NOT NULL COMMENT '好友用户ID',

    remark          VARCHAR(64) DEFAULT NULL COMMENT '备注名',
    group_tag       VARCHAR(64) DEFAULT NULL COMMENT '分组/标签',

    status          TINYINT     NOT NULL DEFAULT 1 COMMENT '1正常 2已删除',

    created_at      DATETIME(3) NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3) NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (user_id, friend_id),
    KEY idx_friend (friend_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='好友表';


-- -----------------------------------------------------------------------------
-- im_friend_request 好友申请表
-- 防骚扰频控（同一人 24h 最多 3 次，PRD REL-003）由 Redis 计数实现，不落本表
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_friend_request (
    id              BIGINT       NOT NULL COMMENT '主键（雪花）',
    from_user_id    BIGINT       NOT NULL COMMENT '申请人',
    to_user_id      BIGINT       NOT NULL COMMENT '被申请人',

    verify_message  VARCHAR(255) DEFAULT NULL COMMENT '验证语',

    status          TINYINT      NOT NULL DEFAULT 0
                    COMMENT '0待处理 1同意 2拒绝 3忽略',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    handled_at      DATETIME(3)  DEFAULT NULL COMMENT '处理时间(UTC)',

    PRIMARY KEY (id),
    KEY idx_to_status (to_user_id, status, created_at),
    KEY idx_from (from_user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='好友申请表';


-- -----------------------------------------------------------------------------
-- im_blacklist 黑名单表
-- 发送消息前的风控步骤校验，Redis Set blacklist:{userId} 缓存
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_blacklist (
    user_id         BIGINT      NOT NULL COMMENT '用户ID',
    blocked_user_id BIGINT      NOT NULL COMMENT '被拉黑用户ID',

    created_at      DATETIME(3) NOT NULL COMMENT '创建时间(UTC)',

    PRIMARY KEY (user_id, blocked_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='黑名单表';


-- =============================================================================
-- 四、会话                                       【逻辑库：conversation_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_conversation 会话表
-- conv_id 生成规则（统一口径）：
--   单聊 conv_id = hash64(min(uidA,uidB) || max(uidA,uidB))，保证双向命中同一会话
--   群聊 conv_id = group_id
--   系统会话 / 机器人会话使用独立 ID 段
-- 注意：哈希存在理论碰撞，落库前必须做 uk_conv_id 冲突检测，禁止静默覆盖
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_conversation (
    id              BIGINT       NOT NULL COMMENT '物理主键（雪花）',
    conv_id         BIGINT       NOT NULL COMMENT '会话业务ID，全局唯一',

    conv_type       TINYINT      NOT NULL
                    COMMENT '1单聊 2群聊 3系统会话 4机器人会话',

    owner_id        BIGINT       DEFAULT NULL COMMENT '发起人',
    target_id       BIGINT       DEFAULT NULL COMMENT '单聊对端用户ID',
    group_id        BIGINT       DEFAULT NULL COMMENT '群聊对应群ID',

    last_msg_seq    BIGINT       NOT NULL DEFAULT 0 COMMENT '会话最新Seq（冗余摘要）',
    last_msg_id     BIGINT       DEFAULT NULL COMMENT '最后一条消息ID（冗余摘要）',
    last_msg_time   DATETIME(3)  DEFAULT NULL COMMENT '最后一条消息时间（会话列表排序依据）',

    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '1正常 2已解散/归档',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),
    UNIQUE KEY uk_conv_id (conv_id),
    KEY idx_group (group_id),
    KEY idx_owner (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='会话表';


-- -----------------------------------------------------------------------------
-- im_conversation_member 会话成员表
-- 承载 PRD SYNC-006 要求的多端同步状态：置顶、免打扰、删除、未读
-- 注意：last_read_seq 不在此表，已读水位唯一来源为 im_read_watermark
--       （避免高频已读上报与低频设置挤同一行造成行锁热点）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_conversation_member (
    conv_id          BIGINT      NOT NULL COMMENT '会话ID',
    user_id          BIGINT      NOT NULL COMMENT '用户ID',

    role             TINYINT     NOT NULL DEFAULT 1 COMMENT '1成员 2管理员 3群主',

    last_del_seq     BIGINT      NOT NULL DEFAULT 0 COMMENT '本地/多端删除水位',

    unread_count     INT         NOT NULL DEFAULT 0 COMMENT '未读数（冗余，异步校准）',

    is_top           TINYINT     NOT NULL DEFAULT 0 COMMENT '是否置顶 0否 1是',
    is_muted         TINYINT     NOT NULL DEFAULT 0 COMMENT '是否免打扰 0否 1是',
    is_hidden        TINYINT     NOT NULL DEFAULT 0 COMMENT '会话是否已从列表删除 0否 1是',

    conv_version     BIGINT      NOT NULL DEFAULT 0 COMMENT '状态变更版本号',

    joined_at        DATETIME(3) NOT NULL COMMENT '加入时间(UTC)',
    updated_at       DATETIME(3) NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (conv_id, user_id),
    KEY idx_user_conv (user_id, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='会话成员表';


-- -----------------------------------------------------------------------------
-- im_conversation_draft 会话草稿表
-- 独立成表，不放在 im_conversation_member：草稿是高频写，
-- 与置顶/免打扰同表会造成频繁行更新与 binlog 膨胀
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_conversation_draft (
    conv_id         BIGINT      NOT NULL COMMENT '会话ID',
    user_id         BIGINT      NOT NULL COMMENT '用户ID',

    content         TEXT        DEFAULT NULL COMMENT '草稿内容（含富文本结构）',

    updated_at      DATETIME(3) NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (conv_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='会话草稿表';


-- =============================================================================
-- 五、消息                                       【逻辑库：message_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_message 消息表（系统最核心）
-- 分片：hash(conv_id) → 16 库 x 256 表（生产形态见 02_im_sharding.sql）
-- 开发期单库形态即本表，无分片后缀。
--
-- 三个 ID 的职责（不可混用）：
--   client_msg_id  客户端幂等键，重试携带同一值
--   server_msg_id  服务端唯一消息 ID，对外引用
--   seq            会话内排序、漫游游标、已读水位依据
--
-- 幂等两级防线：Redis SETNX msg:idem:{senderId}:{clientMsgId}(TTL 5min) + 本表 uk_client_msg
-- 顺序最终保证：SeqService 单调发号 + 本表 uk_conv_seq
--
-- 【偏差 A】本表不按月分区。
--   原因：MySQL 分区表要求"每个唯一索引都必须包含分区表达式中的所有列"。
--   本表按月分区（分区键 created_at）时，uk_conv_seq(conv_id, seq) 与
--   uk_client_msg(sender_id, client_msg_id) 均不含 created_at，建表会被拒绝
--   （ERROR 1503: A PRIMARY KEY must include all columns in the
--    table's partitioning function）。
--   取舍：幂等与顺序的唯一约束优先级高于分区清理便利性；
--         数据量已由 conv_id 分片（16 库 x 256 表）承担，无需再叠按月分区。
--         过期数据由 DataArchiveJob 归档 + 按分片表整体清理。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_message (
    id              BIGINT       NOT NULL COMMENT '雪花ID，服务端全局唯一',

    conv_id         BIGINT       NOT NULL COMMENT '会话ID（分片键）',
    conv_type       TINYINT      NOT NULL COMMENT '冗余会话类型，避免回查会话表',
    seq             BIGINT       NOT NULL COMMENT '会话内单调递增序号',

    server_msg_id   BIGINT       NOT NULL COMMENT '对外消息ID',
    client_msg_id   CHAR(36)     NOT NULL COMMENT '客户端幂等键（UUID）',
    sender_id       BIGINT       NOT NULL COMMENT '发送者用户ID',

    msg_type        SMALLINT     NOT NULL
                    COMMENT '1文本 2图片 3语音 4视频 5文件 6位置 7名片 8合并转发 9系统 100自定义',
    biz_type        VARCHAR(64)  DEFAULT NULL COMMENT '业务子类型，插件化扩展',

    content         MEDIUMBLOB   DEFAULT NULL COMMENT '消息体（protobuf/JSON，加密后存储）',

    status          TINYINT      NOT NULL DEFAULT 1
                    COMMENT '1正常 2已撤回 3已删除 4审核拦截',
    recall_time     DATETIME(3)  DEFAULT NULL COMMENT '撤回时间(UTC)',
    audit_flag      TINYINT      NOT NULL DEFAULT 0 COMMENT '是否命中审计留存策略 0否 1是',

    send_time       DATETIME(3)  NOT NULL COMMENT '发送端时间（展示用）',
    created_at      DATETIME(3)  NOT NULL COMMENT '服务端接收时间（排序与归档基准）',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),

    UNIQUE KEY uk_conv_seq (conv_id, seq),
    UNIQUE KEY uk_client_msg (sender_id, client_msg_id),

    KEY idx_conv_time (conv_id, send_time),
    KEY idx_sender_time (sender_id, send_time),
    KEY idx_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ROW_FORMAT=DYNAMIC
  COMMENT='消息表（开发期单库形态；生产按 conv_id 分片）';


-- -----------------------------------------------------------------------------
-- im_message_attachment 消息附件关系表
-- 与 im_message 同分片（conv_id），保证正文与附件同库，避免跨库事务
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_message_attachment (
    conv_id         BIGINT      NOT NULL COMMENT '会话ID',
    message_seq     BIGINT      NOT NULL COMMENT '消息会话内序号',

    file_id         BIGINT      NOT NULL COMMENT '文件ID',

    attachment_type TINYINT     NOT NULL COMMENT '1图片 2视频 3语音 4文件',
    sort_no         INT         NOT NULL DEFAULT 0 COMMENT '同一消息内多附件顺序',

    created_at      DATETIME(3) NOT NULL COMMENT '创建时间(UTC)',

    PRIMARY KEY (conv_id, message_seq, file_id),
    KEY idx_file (file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='消息附件关系表';


-- =============================================================================
-- 六、消息状态                                   【逻辑库：message_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_message_receipt 消息回执表
-- 【使用约束】仅用于单聊（C2C）。
--   群聊禁止逐条建回执：1 条群消息 x 5000 人 = 5000 行，写入放大 5000 倍。
--   群聊已读统一走 im_read_watermark 水位模型。
--   若产品确需群内"谁已读"明细，采用采样/限额策略（仅前 N 名 + 群主/管理员可见）。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_message_receipt (
    conv_id         BIGINT      NOT NULL COMMENT '会话ID',
    message_seq     BIGINT      NOT NULL COMMENT '消息会话内序号',

    user_id         BIGINT      NOT NULL COMMENT '接收方用户ID',

    delivered_at    DATETIME(3) DEFAULT NULL COMMENT '送达时间(UTC)',
    read_at         DATETIME(3) DEFAULT NULL COMMENT '已读时间(UTC)',

    PRIMARY KEY (conv_id, message_seq, user_id),
    KEY idx_user_read (user_id, read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='消息回执表（仅单聊）';


-- -----------------------------------------------------------------------------
-- im_read_watermark 已读水位表
-- 【唯一事实来源】已读状态以本表为准，im_conversation_member 不冗余 last_read_seq
-- 【只进不退】更新必须使用 GREATEST，防止端上乱序上报导致水位回退：
--   UPDATE im_read_watermark
--      SET last_read_seq = GREATEST(last_read_seq, ?), updated_at = NOW(3)
--    WHERE conv_id = ? AND user_id = ?;
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_read_watermark (
    conv_id         BIGINT      NOT NULL COMMENT '会话ID',
    user_id         BIGINT      NOT NULL COMMENT '用户ID',

    last_read_seq   BIGINT      NOT NULL DEFAULT 0 COMMENT '已读水位',

    updated_at      DATETIME(3) NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (conv_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='已读水位表';


-- =============================================================================
-- 七、群组                                       【逻辑库：group_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_group 群表
-- group_id 同时作为群聊会话的 conv_id
-- 人数上限默认值对应 PRD 3.3：普通群500 / 部门群2000 / 超级大群5000 / 会议群10000
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_group (
    group_id        BIGINT       NOT NULL COMMENT '群ID（雪花），同时作为群聊 conv_id',

    group_type      TINYINT      NOT NULL
                    COMMENT '1普通群 2部门群 3项目群 4超级大群 5会议/直播群',

    name            VARCHAR(128) NOT NULL COMMENT '群名称',
    avatar_url      VARCHAR(512) DEFAULT NULL COMMENT '群头像',

    owner_id        BIGINT       NOT NULL COMMENT '群主用户ID',

    max_members     INT          NOT NULL DEFAULT 500 COMMENT '人数上限',

    notice          TEXT         DEFAULT NULL COMMENT '群公告',

    mute_all        TINYINT      NOT NULL DEFAULT 0 COMMENT '全员禁言 0否 1是',

    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '1正常 2已解散',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (group_id),
    KEY idx_owner (owner_id),
    KEY idx_type_status (group_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='群表';


-- -----------------------------------------------------------------------------
-- im_group_member 群成员表
-- 【join_seq 是关键】作为历史消息可见性分界，避免新成员读到入群前历史消息。
--   例：群当前 Seq=10000，用户 A 在 Seq=8000 加群 → A 只能看到 Seq >= 8000。
--   拉取统一条件：seq >= member.join_seq AND seq > member.last_read_seq
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_group_member (
    group_id        BIGINT      NOT NULL COMMENT '群ID',
    user_id         BIGINT      NOT NULL COMMENT '用户ID',

    role            TINYINT     NOT NULL DEFAULT 1
                    COMMENT '1成员 2管理员 3群主',

    join_seq        BIGINT      NOT NULL COMMENT '入群时的群Seq，历史可见性分界',
    join_time       DATETIME(3) NOT NULL COMMENT '入群时间(UTC)',

    mute_until      DATETIME(3) DEFAULT NULL COMMENT '个体禁言到期时间(UTC)',

    inviter_id      BIGINT      DEFAULT NULL COMMENT '邀请人用户ID',

    status          TINYINT     NOT NULL DEFAULT 1 COMMENT '1正常 2已退群/被移除',

    created_at      DATETIME(3) NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3) NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (group_id, user_id),
    KEY idx_user_group (user_id, group_id),
    KEY idx_group_role (group_id, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='群成员表';


-- =============================================================================
-- 八、多端同步                                   【逻辑库：sync_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_user_sync 用户同步版本表
-- sync_key 为账号级全局单调递增版本号，任何影响该账号的状态变更都使其 +1
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_user_sync (
    user_id         BIGINT      NOT NULL COMMENT '用户ID',

    sync_key        BIGINT      NOT NULL DEFAULT 0 COMMENT '账号级全局版本号',

    updated_at      DATETIME(3) NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='用户同步版本表';


-- -----------------------------------------------------------------------------
-- im_sync_log 同步变更日志表
-- 分片：按 user_id；保留 7 天（ADR-004），按天 RANGE 分区 + DROP PARTITION 清理
--
-- 【偏差 B-1】主键调整为 (id, created_at)，uk_user_sync 降级为普通索引。
--   原因：MySQL 分区表要求每个唯一索引都包含分区表达式中的全部列。
--         分区键为 created_at 时，PRIMARY KEY (id) 与 UNIQUE (user_id, sync_key)
--         均不含 created_at，建表会被拒绝。
--   取舍：(user_id, sync_key) 的唯一性由服务端单点单调发号保证，
--         逻辑上不可能冲突；保留分区带来的"DROP PARTITION 秒级清理 7 天数据"
--         收益远大于该唯一约束的兜底价值。
--         id 为雪花 ID，单独即唯一，(id, created_at) 仍能唯一标识一行。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_sync_log (
    id              BIGINT       NOT NULL COMMENT '主键（雪花）',

    user_id         BIGINT       NOT NULL COMMENT '用户ID（分片键）',

    sync_key        BIGINT       NOT NULL COMMENT '该用户下的单调版本号',

    event_type      VARCHAR(64)  NOT NULL
                    COMMENT 'MESSAGE_NEW/READ_UPDATE/CONV_TOP/CONV_MUTE/CONV_DELETE/DRAFT_UPDATE/GROUP_JOIN',

    entity_type     VARCHAR(32)  DEFAULT NULL COMMENT '实体类型',
    entity_id       BIGINT       DEFAULT NULL COMMENT '实体ID',

    payload         JSON         DEFAULT NULL COMMENT '变更内容（增量下发）',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)，分区键',

    PRIMARY KEY (id, created_at),
    KEY idx_user_key (user_id, sync_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='同步变更日志表（保留7天）'
PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p20261001 VALUES LESS THAN (TO_DAYS('2026-10-02')),
    PARTITION p20261002 VALUES LESS THAN (TO_DAYS('2026-10-03')),
    PARTITION p20261003 VALUES LESS THAN (TO_DAYS('2026-10-04')),
    PARTITION pmax     VALUES LESS THAN MAXVALUE
);


-- =============================================================================
-- 九、文件                                       【逻辑库：file_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_file 文件元数据表
-- 文件本体存对象存储（MinIO/OSS/S3），本表只存元数据
-- idx_md5 支撑秒传：客户端先算 MD5，命中即直接返回 file_id
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_file (
    file_id         BIGINT       NOT NULL COMMENT '文件ID（雪花）',

    user_id         BIGINT       NOT NULL COMMENT '上传者用户ID',

    file_name       VARCHAR(255) NOT NULL COMMENT '文件名',
    file_size       BIGINT       NOT NULL COMMENT '文件大小（字节）',

    content_type    VARCHAR(128) DEFAULT NULL COMMENT 'MIME类型',

    md5             CHAR(32)     DEFAULT NULL COMMENT 'MD5（秒传与去重）',
    sha256          CHAR(64)     DEFAULT NULL COMMENT 'SHA256',

    storage_key     VARCHAR(512) NOT NULL COMMENT '对象存储 Key',
    bucket          VARCHAR(128) DEFAULT NULL COMMENT '存储桶',

    status          TINYINT      NOT NULL DEFAULT 1
                    COMMENT '1正常 2审核不通过 3已删除 4回收站',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (file_id),
    KEY idx_user_time (user_id, created_at),
    KEY idx_md5 (md5),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='文件元数据表';


-- =============================================================================
-- 十、收藏                                       【逻辑库：favorite_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_message_favorite 消息收藏表
-- 收藏是跨会话的，因此按 user_id 分片而非 conv_id（PRD C2C-009）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_message_favorite (
    id              BIGINT       NOT NULL COMMENT '主键（雪花）',

    user_id         BIGINT       NOT NULL COMMENT '用户ID（分片键）',

    conv_id         BIGINT       NOT NULL COMMENT '源会话ID',
    message_seq     BIGINT       NOT NULL COMMENT '源消息会话内序号',

    remark          VARCHAR(255) DEFAULT NULL COMMENT '收藏备注',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',

    PRIMARY KEY (id),
    UNIQUE KEY uk_user_message (user_id, conv_id, message_seq),
    KEY idx_user_time (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='消息收藏表';


-- =============================================================================
-- 十一、离线与推送                               【逻辑库：push_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_offline_message 离线消息表
-- 【重要约束】离线队列的实时消费不依赖 MySQL。
--   实际链路：Kafka -> DeliverService -> 在线? 是→GW / 否→Redis|Kafka -> Push
--   本表只作为最终兜底与历史记录（重试扫描、投递率统计、对账），不进实时热路径。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_offline_message (
    id              BIGINT      NOT NULL COMMENT '主键（雪花）',

    user_id         BIGINT      NOT NULL COMMENT '接收方用户ID（分片键）',

    conv_id         BIGINT      NOT NULL COMMENT '会话ID',
    message_seq     BIGINT      NOT NULL COMMENT '消息会话内序号',

    retry_count     INT         NOT NULL DEFAULT 0 COMMENT '已重试次数',

    status          TINYINT     NOT NULL DEFAULT 0
                    COMMENT '0待投递 1成功 2失败',

    next_retry_at   DATETIME(3) DEFAULT NULL COMMENT '下次重试时间(UTC)',

    created_at      DATETIME(3) NOT NULL COMMENT '创建时间(UTC)',
    delivered_at    DATETIME(3) DEFAULT NULL COMMENT '投递成功时间(UTC)',

    PRIMARY KEY (id),
    KEY idx_user_status (user_id, status, created_at),
    KEY idx_retry (status, next_retry_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='离线消息表';


-- -----------------------------------------------------------------------------
-- im_push_device 推送设备表
-- 一个设备可同时绑定多个通道（厂商通道 + 自建通道），故 push_token 归口本表，
-- im_user_device 不冗余该字段
-- Token 失效（APNs 返回 410）自动置 token_status=2 并清理
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_push_device (
    id              BIGINT       NOT NULL COMMENT '主键（雪花）',
    user_id         BIGINT       NOT NULL COMMENT '用户ID',

    device_id       VARCHAR(128) NOT NULL COMMENT '设备标识，与 im_user_device.device_id 对应',

    platform        VARCHAR(16)  NOT NULL COMMENT '平台 ios/android/harmony',
    push_channel    VARCHAR(32)  NOT NULL
                    COMMENT '推送通道 apns/fcm/huawei/xiaomi/oppo/vivo/honor/self',

    push_token      VARCHAR(512) NOT NULL COMMENT '推送令牌',

    token_status    TINYINT      NOT NULL DEFAULT 1 COMMENT '1有效 2失效(410)',

    last_active_at  DATETIME(3)  DEFAULT NULL COMMENT '最近活跃时间(UTC)',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),
    UNIQUE KEY uk_channel_token (push_channel, push_token(255)),
    KEY idx_user_status (user_id, token_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='推送设备表';


-- =============================================================================
-- 十二、审计                                     【逻辑库：audit_db（独立实例）】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_audit_log 审计日志表
-- 【必须独立实例】与业务库物理隔离，独立账号；架构上消费 Kafka 事件，不阻塞核心链路
-- 留存 >= 180 天（PRD ADM-005）；消息调阅需双人授权，全量留痕且不可删除
--
-- 【偏差 B-2】主键调整为 (id, created_at)，原因同 im_sync_log（分区键必须包含在
--   所有唯一索引中）。本表无其他唯一索引，调整后无额外损失。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_audit_log (
    id              BIGINT       NOT NULL COMMENT '主键（雪花）',

    tenant_id       BIGINT       DEFAULT NULL COMMENT '租户ID（多租户预留）',

    operator_id     BIGINT       DEFAULT NULL COMMENT '操作人用户ID',

    action          VARCHAR(64)  NOT NULL
                    COMMENT 'LOGIN/MSG_RECALL/FILE_EXPORT/ADMIN_CONFIG/MSG_QUERY',

    target_type     VARCHAR(64)  DEFAULT NULL COMMENT '操作对象类型',
    target_id       VARCHAR(128) DEFAULT NULL COMMENT '操作对象ID',

    request_id      VARCHAR(64)  DEFAULT NULL COMMENT '全链路 TraceID',

    detail          JSON         DEFAULT NULL COMMENT '变更前后快照、查询条件、授权单号',

    client_ip       VARCHAR(64)  DEFAULT NULL COMMENT '客户端IP',

    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)，分区键',

    PRIMARY KEY (id, created_at),
    KEY idx_operator_time (operator_id, created_at),
    KEY idx_target (target_type, target_id),
    KEY idx_time (created_at),
    KEY idx_action (action, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='审计日志表（留存>=180天）'
PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p202610 VALUES LESS THAN (TO_DAYS('2026-11-01')),
    PARTITION p202611 VALUES LESS THAN (TO_DAYS('2026-12-01')),
    PARTITION pmax    VALUES LESS THAN MAXVALUE
);


-- =============================================================================
-- 十三、机器人与开放平台                         【逻辑库：bot_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_bot 机器人表
-- 机器人发消息复用核心消息链路（bizType=robot），发前必须校验其为目标会话成员
-- secret_cipher 不存明文，由 KMS 托管并定期轮换
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_bot (
    bot_id          BIGINT         NOT NULL COMMENT '机器人ID（雪花）',

    app_id          VARCHAR(64)    NOT NULL COMMENT '开放平台应用标识',

    name            VARCHAR(128)   NOT NULL COMMENT '机器人名称',
    avatar_url      VARCHAR(512)   DEFAULT NULL COMMENT '机器人头像',

    bot_type        TINYINT        NOT NULL DEFAULT 1 COMMENT '1系统机器人 2业务机器人',

    owner_user_id   BIGINT         DEFAULT NULL COMMENT '负责人用户ID',

    callback_url    VARCHAR(512)   DEFAULT NULL COMMENT '事件回调地址',

    secret_cipher   VARBINARY(512) DEFAULT NULL COMMENT 'HMAC签名密钥密文（KMS托管）',

    rate_limit_qpm  INT            NOT NULL DEFAULT 100 COMMENT '每分钟调用配额',

    status          TINYINT        NOT NULL DEFAULT 1 COMMENT '1正常 2停用',

    created_at      DATETIME(3)    NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)    NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (bot_id),
    UNIQUE KEY uk_app_id (app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='机器人表';


-- -----------------------------------------------------------------------------
-- im_bot_webhook 机器人事件订阅表
-- 事件清单见 PRD 10.4；重试状态不放本表（由投递组件与死信队列承担，避免热点）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_bot_webhook (
    id              BIGINT         NOT NULL COMMENT '主键（雪花）',
    bot_id          BIGINT         NOT NULL COMMENT '机器人ID',

    event_type      VARCHAR(64)    NOT NULL
                    COMMENT 'message.sent/message.recalled/group.member.joined/card.action',

    callback_url    VARCHAR(512)   NOT NULL COMMENT '回调地址',
    secret_cipher   VARBINARY(512) DEFAULT NULL COMMENT '签名密钥密文（KMS托管）',

    enabled         TINYINT        NOT NULL DEFAULT 1 COMMENT '是否启用 0否 1是',

    created_at      DATETIME(3)    NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)    NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (id),
    UNIQUE KEY uk_bot_event (bot_id, event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='机器人事件订阅表';


-- =============================================================================
-- 十四、系统配置                                 【逻辑库：bot_db】
-- =============================================================================

-- -----------------------------------------------------------------------------
-- im_system_config 系统配置表
-- 【职责边界】运行时功能开关、灰度比例走配置中心（Nacos），不落本表；
--   本表只承载需持久化与变更审计的业务策略（消息保留期限、群人数上限、
--   邀请开关、敏感词策略等级等）。变更必须写入 im_audit_log。
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS im_system_config (
    config_key      VARCHAR(128) NOT NULL COMMENT '配置键',
    scope           TINYINT      NOT NULL DEFAULT 1 COMMENT '1全局 2组织 3部门',
    scope_id        BIGINT       NOT NULL DEFAULT 0 COMMENT '范围ID，scope=1 时为 0',

    config_value    TEXT         NOT NULL COMMENT '配置值',
    value_type      VARCHAR(16)  NOT NULL DEFAULT 'string'
                    COMMENT '值类型 string/int/bool/json',

    description     VARCHAR(255) DEFAULT NULL COMMENT '配置说明',

    updated_by      BIGINT       DEFAULT NULL COMMENT '最后修改人',
    created_at      DATETIME(3)  NOT NULL COMMENT '创建时间(UTC)',
    updated_at      DATETIME(3)  NOT NULL COMMENT '更新时间(UTC)',

    PRIMARY KEY (config_key, scope, scope_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='系统配置表';


-- =============================================================================
-- 建表完成自检
-- =============================================================================
-- 预期结果：26
SELECT COUNT(*) AS table_count
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'chatflow_dev';


-- =============================================================================
-- 偏差说明（DDL 落地时发现，建议同步修订《IM数据库表结构设计文档》）
-- =============================================================================
-- 【偏差 A】im_message 取消按月分区
--   文档原文：im_message 按 conv_id 哈希分片 + 按月 RANGE 分区（第 9.1 章）
--   问题：MySQL 分区表要求每个唯一索引都包含分区表达式中的全部列。
--         按月分区后，uk_conv_seq(conv_id, seq) 与
--         uk_client_msg(sender_id, client_msg_id) 均不含 created_at，建表报错：
--         ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the
--         table's partitioning function
--   处理：取消分区。数据量由 conv_id 分片（16 库 x 256 表）承担；
--         过期数据由 DataArchiveJob 归档 + 分片表整体清理。
--   备选：若必须分区，只能将分区键改为 conv_id（HASH 分区），
--         但仍要求 uk_client_msg 包含 conv_id，需改唯一键语义，不推荐。
--
-- 【偏差 B】im_sync_log / im_audit_log 主键与唯一索引调整
--   文档原文：两表均按 created_at 按天 RANGE 分区；sync_log 有
--             UNIQUE (user_id, sync_key)，两表主键均为 (id)
--   问题：同上，(id) 与 (user_id, sync_key) 均不含 created_at，建表报错
--   处理：
--     - 主键改为 (id, created_at)。id 为雪花 ID 单独即唯一，不损失唯一性。
--     - im_sync_log 的 UNIQUE (user_id, sync_key) 降级为普通索引 idx_user_key。
--       理由：sync_key 由服务端单点单调发号，逻辑上不可能冲突；
--             保留 DROP PARTITION 秒级清理 7 天数据的收益远大于该约束的兜底价值。
--   ⚠️ 影响：数据库设计文档第 19 章"骨架索引"清单中的第 ⑤ 项
--      UNIQUE (user_id, sync_key) 需相应修订为普通索引。
-- =============================================================================

-- — 文件结束 —
