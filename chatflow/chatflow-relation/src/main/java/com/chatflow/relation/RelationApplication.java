package com.chatflow.relation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 关系链服务。
 *
 * 职责（工程结构文档 13）：好友 / 好友申请 / 黑名单 / 联系人。
 * 核心表：im_friend / im_friend_request / im_blacklist。
 * 缓存：好友关系 Redis Set（friend:{userId}），MySQL 为准；
 * 黑名单在发送前风控步骤校验。
 *
 * 计划包结构：controller / grpc / service / domain / repository / mapper / entity / dto / config。
 */
@SpringBootApplication
public class RelationApplication {

    public static void main(String[] args) {
        SpringApplication.run(RelationApplication.class, args);
    }
}
