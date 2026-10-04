package com.chatflow.common.exception;

import com.chatflow.common.result.ErrorCode;

/**
 * 公共业务异常：携带错误码（ErrorCode 分段），由各服务的全局异常处理器统一转为 Result。
 */
public class ChatFlowException extends RuntimeException {

    private final String code;

    public ChatFlowException(String code, String message) {
        super(message);
        this.code = code;
    }

    public ChatFlowException(ErrorCode errorCode) {
        super(errorCode.defaultMessage());
        this.code = errorCode.code();
    }

    public ChatFlowException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.code();
    }

    public ChatFlowException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.code = errorCode.code();
    }

    public String code() {
        return code;
    }
}
