package com.chatflow.common.result;

/**
 * 错误码分段规约（架构文档 10.2）：
 *
 * 1xxx 参数错误；2xxx 认证与权限；3xxx 业务规则；4xxx 限流；5xxx 系统错误。
 */
public enum ErrorCode {

    // ---------- 1xxx 参数 ----------
    INVALID_PARAM("1000", "参数错误"),
    PARAM_MISSING("1001", "缺少必填参数"),
    PARAM_OUT_OF_RANGE("1002", "参数超出范围"),
    PARAM_FORMAT_INVALID("1003", "参数格式不正确"),

    // ---------- 2xxx 认证与权限 ----------
    UNAUTHORIZED("2000", "未认证"),
    TOKEN_EXPIRED("2001", "Token 已过期"),
    TOKEN_INVALID("2002", "Token 无效"),
    FORBIDDEN("2003", "无权限"),
    NOT_CONVERSATION_MEMBER("2004", "非会话成员，禁止访问"),
    DEVICE_KICKED("2005", "设备已在其他端登录"),

    // ---------- 3xxx 业务规则 ----------
    BIZ_RULE_CONFLICT("3000", "业务规则冲突"),
    BLACKLIST_BLOCKED("3001", "对方已将你加入黑名单"),
    MUTED_IN_GROUP("3002", "已被禁言"),
    RECALL_WINDOW_EXPIRED("3003", "已超过可撤回时间"),
    MESSAGE_RECALLED("3004", "消息已撤回"),
    FRIEND_REQUEST_DUPLICATED("3005", "好友申请已存在"),
    GROUP_MEMBER_LIMIT("3006", "群人数已达上限"),
    QUOTA_EXCEEDED("3007", "配额已用尽"),

    // ---------- 4xxx 限流 ----------
    RATE_LIMITED("4000", "请求过于频繁"),
    CONNECTION_LIMITED("4001", "连接数超限"),

    // ---------- 5xxx 系统 ----------
    INTERNAL_ERROR("5000", "系统繁忙，请稍后重试"),
    DEPENDENCY_UNAVAILABLE("5001", "依赖服务暂不可用"),
    PERSIST_QUEUE_UNCONFIRMED("5002", "消息未达到持久化可靠性边界，请重试"),
    SEQ_ALLOCATE_FAILED("5003", "序列号分配失败");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String code() {
        return code;
    }

    public String defaultMessage() {
        return defaultMessage;
    }
}
