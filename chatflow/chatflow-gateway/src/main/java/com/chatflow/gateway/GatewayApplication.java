package com.chatflow.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 长连接接入网关（GW）。
 *
 * 职责（工程结构文档 11.2）：连接建立 / 鉴权 / 心跳 / 连接管理 / 消息收发 / 路由 / 限流 / 背压。
 * 关键约束：单节点目标 5 万连接（硬上限 6 万）、发送队列 256 条背压、
 * 心跳 30s/90s 判离线；实例无会话级持久依赖，可任意扩缩容与滚动发布。
 *
 * 计划包结构：config / websocket / handler / protocol / connection /
 * route / heartbeat / auth / limiter。
 */
@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
