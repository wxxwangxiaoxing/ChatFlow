package com.chatflow.infrastructure.redis;

/**
 * Redis 键名统一收口（工程结构文档 30）。
 *
 * 逻辑键名沿用架构文档口径；物理键名 = chatflow:{env}:{逻辑键名}，
 * {@code env} 由基础设施启动时注入，多环境共用 Redis 时用于隔离。
 *
 * 硬性规约：业务代码禁止自行拼接键名字符串，一律引用本类；
 * 所有键必须显式声明 TTL（永久键除外）；禁止 KEYS，改用 SCAN；
 * 单 key ≤ 10KB、Hash/ZSet 元素 ≤ 5000，超限拆分。
 */
public final class RedisKeys {

    /** 环境前缀，由各服务 application.yml 注入（dev/test/staging/prod） */
    private static String envPrefix = "chatflow:dev:";

    private RedisKeys() {
    }

    /** 由各服务启动配置调用一次；生产禁止使用 dev 默认值 */
    public static void initEnv(String env) {
        RedisKeys.envPrefix = "chatflow:" + env + ":";
    }

    // ---------- 在线与路由（TTL 90s，心跳批量续期） ----------

    /** 在线状态 Hash：{online, lastActive, conns...} */
    public static String presence(String userId) {
        return envPrefix + "presence:" + userId;
    }

    /** 用户→网关节点路由 Hash：{gwNodeId, connId, deviceId, lastHeartbeat} */
    public static String route(String userId) {
        return envPrefix + "route:" + userId;
    }

    // ---------- 消息与序列 ----------

    /** 会话序列号（String，永久；号段落库兜底水位防回退，ADR-002） */
    public static String convSeq(String conversationId) {
        return envPrefix + "conv:seq:" + conversationId;
    }

    /** 消息发送幂等键（String，TTL 5min；维度含 senderId，对齐 uk_client_msg） */
    public static String msgIdem(String senderId, String clientMsgId) {
        return envPrefix + "msg:idem:" + senderId + ":" + clientMsgId;
    }

    // ---------- 会话与未读 ----------

    /** 会话列表摘要（ZSet，member=convId，score=lastMsgTime） */
    public static String convList(String userId) {
        return envPrefix + "conv:list:" + userId;
    }

    /** 未读数 Hash：field=convId，value=未读条数（异步校准） */
    public static String unread(String userId) {
        return envPrefix + "unread:" + userId;
    }

    /** 已读水位（String，TTL 7d；只进不退，架构文档 7.3） */
    public static String readWatermark(String conversationId, String userId) {
        return envPrefix + "read:wm:" + conversationId + ":" + userId;
    }

    // ---------- 同步 ----------

    /** 账号级同步版本号 SyncKey（String，永久，原子递增） */
    public static String syncVersion(String userId) {
        return envPrefix + "sync:" + userId;
    }

    // ---------- 关系链 ----------

    /** 好友 ID Set（MySQL 为准，Cache-Aside） */
    public static String friendSet(String userId) {
        return envPrefix + "friend:" + userId;
    }

    /** 黑名单 ID Set（发送前风控校验） */
    public static String blacklistSet(String userId) {
        return envPrefix + "blacklist:" + userId;
    }

    // ---------- 群组 ----------

    /** 群成员角色缓存（String，TTL 5-30s + 事件失效） */
    public static String groupRole(String groupId, String userId) {
        return envPrefix + "group:role:" + groupId + ":" + userId;
    }
}
