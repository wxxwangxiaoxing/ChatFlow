package com.chatflow.common.result;

/**
 * 统一返回结构（架构文档 10.2）：{code, message, data, traceId}。
 *
 * code 为 "0" 表示成功；非 0 取值见 {@link ErrorCode} 分段。
 * traceId 由各入口（HTTP/gRPC/长连接）从链路上下文填充，此处仅承载。
 */
public record Result<T>(String code, String message, T data, String traceId) {

    public static final String CODE_OK = "0";

    public static <T> Result<T> ok(T data) {
        return new Result<>(CODE_OK, "success", data, null);
    }

    public static <T> Result<T> ok() {
        return ok(null);
    }

    public static <T> Result<T> fail(ErrorCode errorCode) {
        return new Result<>(errorCode.code(), errorCode.defaultMessage(), null, null);
    }

    public static <T> Result<T> fail(ErrorCode errorCode, String message) {
        return new Result<>(errorCode.code(), message, null, null);
    }

    public boolean isOk() {
        return CODE_OK.equals(code);
    }
}
