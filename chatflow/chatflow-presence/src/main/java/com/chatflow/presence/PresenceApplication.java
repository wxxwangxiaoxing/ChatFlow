package com.chatflow.presence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 在线状态服务。
 *
 * 职责（工程结构文档 19，ADR-005）：Presence。
 * 关键规则：
 *   - Redis TTL（90s）承载在线态，GW 每 5s 批量上报存活集合，消除心跳风暴；
 *   - DB 仅异步记录 last_online_at（10s 窗口批量合并写）；
 *   - 变更广播 200ms 防抖合并；进入会话才订阅成员 Presence；
 *   - 服务异常降级为 unknown，不影响收发消息。
 * 核心表：im_presence_snapshot / im_subscription（仅低频快照与订阅关系）。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity /
 * dto / consumer / producer / config。
 */
@SpringBootApplication
public class PresenceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PresenceApplication.class, args);
    }
}
