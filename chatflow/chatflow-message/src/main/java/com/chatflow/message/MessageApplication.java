package com.chatflow.message;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 消息服务（核心链路）。
 *
 * 职责（工程结构文档 15）：消息收发 + 序列发号 Seq。
 * ACK 四项条件（工程结构文档 35.2，建议 ADR-009）：
 *   ① 幂等键预占 msg:idem:{senderId}:{clientMsgId}
 *   ② 权限与风控通过（成员/黑名单/敏感词同步部分）
 *   ③ Seq 已分配且号段落库兜底（不回退）
 *   ④ Kafka acks=all 且 min.insync.replicas=2 确认
 * 异步落库失败不影响已发 ACK，由消费者重试 + DLQ + MessageReconcileJob 对账兜底。
 * 分片：消息域按 conv_id 16 库 × 256 表；查询必带 conv_id，seq 游标翻页。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity /
 * dto / event / consumer / producer / config。
 */
@SpringBootApplication
public class MessageApplication {

    public static void main(String[] args) {
        SpringApplication.run(MessageApplication.class, args);
    }
}
