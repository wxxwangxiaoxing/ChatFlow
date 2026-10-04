package com.chatflow.infrastructure.kafka;

/**
 * Kafka Topic 统一收口（工程结构文档 29）。
 *
 * 事件命名：{domain}.{action} 小写点分风格。
 * 分区键规约：会话域事件用 hash(conversationId) 保证分区内有序（ADR-001）；
 * 投递 Topic 按网关节点动态分片 {@link #deliver(String)}，避免全量广播放大。
 *
 * 通用要求：acks=all + min.insync.replicas=2；保留 7 天；
 * 所有消费组必须配置 DLQ + 告警；消费端按业务唯一键幂等。
 */
public final class KafkaTopics {

    private KafkaTopics() {
    }

    /** 消息发送（核心链路入口，分区键 convId） */
    public static final String MSG_SEND = "msg.send";

    /** 消息回执（送达/已读事件） */
    public static final String MSG_RECEIPT = "msg.receipt";

    /** 消息撤回广播 */
    public static final String MSG_RECALL = "msg.recall";

    /** 同步事件（SyncKey 版本推进，分区键 userId） */
    public static final String SYNC_EVENT = "sync.event";

    /** 群组事件（成员变更/群信息变更，分区键 groupId） */
    public static final String GROUP_EVENT = "group.event";

    /** 在线状态事件（下线批量合并写 DB，分区键 userId） */
    public static final String PRESENCE_EVENT = "presence.event";

    /** 推送事件（离线推送决策结果，分区键 userId） */
    public static final String PUSH_EVENT = "push.event";

    /** 审计事件（与业务链路物理隔离） */
    public static final String AUDIT_EVENT = "audit.event";

    /** 搜索索引事件（V1.5 ES 全文搜索启用） */
    public static final String SEARCH_EVENT = "search.event";

    /** 死信队列后缀约定：每个消费组的 DLQ = "{topic}.dlq" */
    public static String dlqOf(String topic) {
        return topic + ".dlq";
    }

    /**
     * 投递 Topic 按网关节点分片（工程结构文档 29.3 修正）：
     * 消息必须推给持有该连接的特定网关节点，单一 topic 只能全量广播。
     */
    public static String deliver(String gatewayNodeId) {
        return "deliver." + gatewayNodeId;
    }
}
