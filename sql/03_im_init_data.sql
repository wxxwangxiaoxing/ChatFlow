-- =============================================================================
--  IM 即时聊天系统（ChatFlow）— 初始化数据脚本
-- -----------------------------------------------------------------------------
--  文件     : 03_im_init_data.sql
--  版本     : V1.0
--  日期     : 2026-10-01
--  对应文档 : 《IM数据库表结构设计文档》V1.0、《IM即时聊天系统需求文档》V1.0
--  前置条件 : 必须先执行 01_im_schema.sql
--  目标库   : MySQL 8.0+ / chatflow_dev
-- -----------------------------------------------------------------------------
--  说明
--  1) 本脚本只包含【系统级初始数据】，不含业务数据。
--  2) 全部使用 INSERT ... ON DUPLICATE KEY UPDATE，重复执行安全。
--  3) 第 5 节的开发调试数据仅供本地联调，生产环境请勿执行。
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

USE chatflow_dev;


-- =============================================================================
-- 一、系统配置（im_system_config）
-- =============================================================================
-- 注意职责边界：功能开关与灰度比例走配置中心（Nacos），不落本表；
-- 本表只放"需持久化与变更审计"的业务策略。
-- scope：1全局 2组织 3部门；scope=1 时 scope_id 固定为 0。
-- =============================================================================

INSERT INTO im_system_config
    (config_key, scope, scope_id, config_value, value_type, description, created_at, updated_at)
VALUES
-- 消息
('message.retention.days',            1, 0, '180',   'int',  '消息保留天数（PRD Open Issue Q3，待决策：180/365/永久）',   NOW(3), NOW(3)),
('message.recall.window.seconds',     1, 0, '120',   'int',  '用户自主撤回时间窗（秒），PRD C2C-006',                    NOW(3), NOW(3)),
('message.recall.admin.window.seconds',1,0, '86400', 'int',  '群主/管理员撤回他人消息时间窗（秒）',                       NOW(3), NOW(3)),
('message.content.max.chars',         1, 0, '5000',  'int',  '单条文本消息最大字符数，PRD MSG-001',                       NOW(3), NOW(3)),

-- 会话与同步
('conversation.roam.default.days',    1, 0, '30',    'int',  '默认漫游消息天数，PRD SYNC-004',                            NOW(3), NOW(3)),
('sync.log.retention.days',           1, 0, '7',     'int',  '同步日志保留天数，ADR-004',                                 NOW(3), NOW(3)),
('conversation.draft.report.delay.ms',1, 0, '3000',  'int',  '草稿上报防抖延迟（毫秒）',                                  NOW(3), NOW(3)),

-- 群组
('group.max.members.normal',          1, 0, '500',   'int',  '普通群人数上限，PRD 3.3',                                   NOW(3), NOW(3)),
('group.max.members.department',      1, 0, '2000',  'int',  '部门群人数上限，PRD 3.3',                                   NOW(3), NOW(3)),
('group.max.members.super',           1, 0, '5000',  'int',  '超级大群人数上限（需超管审批开通），PRD 3.3',               NOW(3), NOW(3)),
('group.max.members.meeting',         1, 0, '10000', 'int',  '会议/直播群人数上限（仅管理员可发言），PRD 3.3',            NOW(3), NOW(3)),
('group.invite.enabled',              1, 0, 'true',  'bool', '是否允许普通成员邀请他人入群',                              NOW(3), NOW(3)),
('group.invite.need.approval',        1, 0, 'false', 'bool', '邀请入群是否需要群主/管理员审批，PRD GRP-003',              NOW(3), NOW(3)),
('group.admin.max.count',             1, 0, '10',    'int',  '单群管理员数量上限，PRD GRP-006',                            NOW(3), NOW(3)),
('group.notice.require.confirm',      1, 0, 'false', 'bool', '群公告是否需确认已读（强公告），PRD GRP-008',               NOW(3), NOW(3)),

-- 关系链
('friend.request.daily.limit',        1, 0, '3',     'int',  '同一人 24h 内最多发起好友申请次数，PRD REL-003',            NOW(3), NOW(3)),

-- 账号与设备
('device.max.concurrent',             1, 0, '4',     'int',  '同账号最大同时在线端数，PRD ACC-006',                       NOW(3), NOW(3)),
('account.logout.cooling.days',       1, 0, '7',     'int',  '账号注销冷静期天数，PRD ACC-011',                           NOW(3), NOW(3)),
('account.login.fail.lock.count',     1, 0, '5',     'int',  '密码连续失败锁定阈值，PRD ACC-002',                         NOW(3), NOW(3)),
('account.login.fail.lock.minutes',   1, 0, '15',    'int',  '密码失败锁定分钟数，PRD ACC-002',                           NOW(3), NOW(3)),

-- 在线状态与长连接
('presence.ttl.seconds',              1, 0, '90',    'int',  'Presence Redis TTL（秒），架构文档 9.2',                    NOW(3), NOW(3)),
('heartbeat.interval.seconds',        1, 0, '30',    'int',  '客户端心跳间隔（秒，前台），架构文档 5.2',                  NOW(3), NOW(3)),
('heartbeat.interval.bg.seconds',     1, 0, '120',   'int',  '客户端心跳间隔（秒，后台），架构文档 5.2',                  NOW(3), NOW(3)),

-- 推送
('push.aggregate.window.seconds',     1, 0, '60',    'int',  '同一用户推送最小间隔（秒），架构文档 10.2',                 NOW(3), NOW(3)),
('push.offline.retain.days',          1, 0, '7',     'int',  '离线消息保留天数',                                          NOW(3), NOW(3)),

-- 内容安全与审计
('sensitive.word.mode',               1, 0, 'local_and_cloud', 'string', '敏感词过滤模式 local/cloud/local_and_cloud',        NOW(3), NOW(3)),
('audit.retention.days',              1, 0, '180',   'int',  '审计日志保留天数（PRD ADM-005），合规场景可延至 3 年',      NOW(3), NOW(3)),
('audit.query.dual.approval',         1, 0, 'true',  'bool', '消息调阅是否强制双人授权，PRD 8.4',                         NOW(3), NOW(3)),

-- 安全
('e2ee.enabled',                      1, 0, 'false', 'bool', '端到端加密开关（租户级，开启后禁用服务端搜索与审计），ADR-007', NOW(3), NOW(3)),
('token.access.expire.hours',         1, 0, '2',     'int',  'Access Token 有效期（小时），架构文档 18.2',                 NOW(3), NOW(3)),
('token.refresh.expire.days',         1, 0, '15',    'int',  'Refresh Token 有效期（天），架构文档 18.2',                  NOW(3), NOW(3))

ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value),
    value_type   = VALUES(value_type),
    description  = VALUES(description),
    updated_at   = VALUES(updated_at);


-- =============================================================================
-- 二、内置系统机器人（im_bot）
-- =============================================================================
-- bot_id 使用固定小值，避免与雪花 ID 冲突（雪花 ID 高位为时间戳，值很大）。
-- 系统会话 / 机器人会话的 conv_id 使用独立 ID 段：
--   系统会话   : 0x10000000 起
--   机器人会话 : 0x20000000 起
-- secret_cipher 生产环境由 KMS 下发，此处留空。
-- =============================================================================

INSERT INTO im_bot
    (bot_id, app_id, name, avatar_url, bot_type, owner_user_id, callback_url,
     secret_cipher, rate_limit_qpm, status, created_at, updated_at)
VALUES
(1, 'system_notice', '系统通知',   NULL, 1, NULL, NULL, NULL, 600, 1, NOW(3), NOW(3)),
(2, 'system_security', '安全提醒', NULL, 1, NULL, NULL, NULL, 300, 1, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
    name           = VALUES(name),
    rate_limit_qpm = VALUES(rate_limit_qpm),
    status         = VALUES(status),
    updated_at     = VALUES(updated_at);


-- =============================================================================
-- 三、机器人事件订阅示例（im_bot_webhook）
-- =============================================================================
-- 仅作示例，生产由开放平台控制台配置。事件清单见 PRD 10.4。
-- =============================================================================

-- INSERT INTO im_bot_webhook (id, bot_id, event_type, callback_url, secret_cipher, enabled, created_at, updated_at)
-- VALUES (1001, 1, 'message.sent',          'https://biz.example.com/hook/msg',   NULL, 1, NOW(3), NOW(3))
-- ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);


-- =============================================================================
-- 四、根部门（im_department）
-- =============================================================================
-- 部门数据原则上由 HR/OA 同步，此处仅初始化一个根节点，便于本地联调。
-- =============================================================================

INSERT INTO im_department
    (id, parent_id, name, path, sort_no, status, created_at, updated_at)
VALUES
(1, 0, '总部', '/1/', 0, 1, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
    name       = VALUES(name),
    path       = VALUES(path),
    updated_at = VALUES(updated_at);


-- =============================================================================
-- 五、开发调试数据【仅本地联调，生产环境请勿执行】
-- =============================================================================
-- 说明
--  1) password_hash 必须由应用的密码编码器生成（bcrypt / argon2），
--     下方为占位值，直接登录会失败。
--  2) 单聊 conv_id 需由应用计算：hash64(min(uidA,uidB) || max(uidA,uidB))。
--     下方用一个 64 位拼装表达式做演示（CRC32 各取 32 位）：
--         conv_id = (CRC32(CONCAT(LEAST(a,b),'-',GREATEST(a,b))) << 32)
--                 |  CRC32(CONCAT(GREATEST(a,b),'-',LEAST(a,b)))
--     ⚠️ 生产必须换成与 ShardingSphere 一致的稳定哈希（如 MurmurHash3）。
-- =============================================================================

-- 5.1 两个测试用户
-- INSERT INTO im_user
--     (id, username, nickname, phone, employee_no, password_hash, status,
--      phone_visible, external_search_enabled, created_at, updated_at)
-- VALUES
-- (100001, 'alice', '爱丽丝', '13800000001', 'E100001', '<bcrypt-hash>', 1, 1, 1, NOW(3), NOW(3)),
-- (100002, 'bob',   '鲍勃',   '13800000002', 'E100002', '<bcrypt-hash>', 1, 1, 1, NOW(3), NOW(3))
-- ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- 5.2 归属根部门
-- INSERT INTO im_user_department (user_id, department_id, is_primary, created_at)
-- VALUES (100001, 1, 1, NOW(3)), (100002, 1, 1, NOW(3))
-- ON DUPLICATE KEY UPDATE created_at = VALUES(created_at);

-- 5.3 建立双向好友关系（必须两条）
-- INSERT INTO im_friend (user_id, friend_id, remark, status, created_at, updated_at)
-- VALUES
-- (100001, 100002, '鲍勃', 1, NOW(3), NOW(3)),
-- (100002, 100001, '爱丽丝', 1, NOW(3), NOW(3))
-- ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- 5.4 创建单聊会话 + 双方成员关系 + 已读水位
-- SET @uid_a = 100001;
-- SET @uid_b = 100002;
-- SET @conv_id = (CRC32(CONCAT(LEAST(@uid_a,@uid_b),'-',GREATEST(@uid_a,@uid_b))) << 32)
--              |  CRC32(CONCAT(GREATEST(@uid_a,@uid_b),'-',LEAST(@uid_a,@uid_b)));
--
-- INSERT INTO im_conversation
--     (id, conv_id, conv_type, owner_id, target_id, last_msg_seq, status, created_at, updated_at)
-- VALUES
--     (@conv_id, @conv_id, 1, @uid_a, @uid_b, 0, 1, NOW(3), NOW(3))
-- ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);
--
-- INSERT INTO im_conversation_member
--     (conv_id, user_id, role, last_del_seq, unread_count, is_top, is_muted, is_hidden,
--      conv_version, joined_at, updated_at)
-- VALUES
--     (@conv_id, @uid_a, 1, 0, 0, 0, 0, 0, 0, NOW(3), NOW(3)),
--     (@conv_id, @uid_b, 1, 0, 0, 0, 0, 0, 0, NOW(3), NOW(3))
-- ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);
--
-- INSERT INTO im_read_watermark (conv_id, user_id, last_read_seq, updated_at)
-- VALUES (@conv_id, @uid_a, 0, NOW(3)), (@conv_id, @uid_b, 0, NOW(3))
-- ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);


-- =============================================================================
-- 六、初始化结果自检
-- =============================================================================

SELECT 'im_system_config' AS table_name, COUNT(*) AS row_count FROM im_system_config
UNION ALL
SELECT 'im_bot',          COUNT(*) FROM im_bot
UNION ALL
SELECT 'im_department',   COUNT(*) FROM im_department;

-- 预期：
--   im_system_config : 30
--   im_bot           : 2
--   im_department    : 1

-- — 文件结束 —
