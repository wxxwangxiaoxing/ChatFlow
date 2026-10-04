package com.chatflow.conversation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 会话服务。
 *
 * 职责（工程结构文档 14）：会话 / 已读回执 Receipt。
 * 核心表：im_conversation / im_conversation_member / im_conversation_draft /
 * im_message_receipt / im_read_watermark。
 * 关键规则：已读水位只进不退（架构文档 7.3）；未读数实时走 Redis + 每日校准。
 * 分片：会话域按 user_id 8 库 × 64 表。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity / dto / consumer / config。
 */
@SpringBootApplication
public class ConversationApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConversationApplication.class, args);
    }
}
