package com.chatflow.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 用户服务。
 *
 * 职责（工程结构文档 12.2）：用户 / 账号 / 设备 / 部门 / 组织 / 用户资料。
 * 核心表：im_user / im_user_device / im_department / im_user_department。
 * 约束：组织架构由 HR 系统事件驱动同步，不提供部门写入口；
 * last_online_at 由 Presence 下线事件异步批量更新，不在心跳路径写库。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity / dto / config。
 */
@SpringBootApplication
public class UserApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}
