package com.cmhb.module.oauth2.model;

import lombok.Data;

@Data
public class Result {
    private boolean successful = true;

    private Integer code;

    private String msg;

    private Object result;
}