package com.cmhb.common.web.handler;

import lombok.Data;

/**
 * @author 王增理
 * @create 2017-08-24
 */
@Data
public class ErrorVo {
    public ErrorVo(int code, String error) {
        this.successful = false;
        this.code = code;
        this.error = error;
    }

    private Boolean successful;
    private int code;
    private String error;
}
