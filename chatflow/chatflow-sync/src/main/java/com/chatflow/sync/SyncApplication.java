package com.chatflow.sync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 多端同步服务。
 *
 * 职责（工程结构文档 17）：SyncKey 增量同步。
 * syncKey 为账号级全局版本号（Redis 原子递增），任何影响该账号的变更 +1；
 * 变更记入 sync_log（按 user 分片，保留 7 天）；hasMore=true 循环拉取直到收敛。
 * 已读/置顶/免打扰/草稿/删除等多端状态 ≤2s 一致（架构文档 7.5）。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity /
 * dto / event / producer / config。
 */
@SpringBootApplication
public class SyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(SyncApplication.class, args);
    }
}
