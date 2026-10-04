package com.chatflow.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 认证服务。
 *
 * 职责（工程结构文档 12.1）：登录 / Token / RefreshToken / 验证码 / 设备认证 / 扫码登录。
 * Token 策略：Access 2h / Refresh 15 天 + 设备绑定（架构文档 18.2）。
 * 对应 PRD ACC-001~ACC-012；SSO 与二次验证为 P1。
 *
 * 计划包结构：controller / service / domain / repository / entity / dto / config。
 */
@SpringBootApplication
public class AuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }
}
