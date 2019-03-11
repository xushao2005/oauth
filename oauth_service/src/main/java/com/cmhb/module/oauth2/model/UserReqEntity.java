package com.cmhb.module.oauth2.model;

import lombok.Data;

/**
 * Created by luxp on 2017/8/22.
 */
@Data
public class UserReqEntity {
    private Long uid;

    private String accessToken;
}
