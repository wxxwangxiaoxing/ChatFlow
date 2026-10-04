package com.chatflow.group;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 群组服务。
 *
 * 职责（工程结构文档 18）：群组 / 成员 / join_seq / 群权限。
 * 关键规则：
 *   - 读写扩散混合（ADR-003）：≤200 人写扩散，>200 人读扩散；
 *   - join_seq 限制新成员只能看到入群后的消息（架构文档 8.2）；
 *   - 群操作统一走 GroupAuthService，角色缓存 TTL 5-30s + 事件失效。
 * 核心表：im_group / im_group_member / im_group_member_shadow / im_group_seq。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity /
 * dto / event / producer / config。
 */
@SpringBootApplication
public class GroupApplication {

    public static void main(String[] args) {
        SpringApplication.run(GroupApplication.class, args);
    }
}
