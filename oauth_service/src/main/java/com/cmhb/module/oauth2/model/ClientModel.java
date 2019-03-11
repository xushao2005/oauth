package com.cmhb.module.oauth2.model;


import lombok.Data;

/**
 * Created by luxp on 2017/6/1.
 */
@Data
public class ClientModel {
    private Long id;
    private String applicationName;
    private String description;
    private String secretKey;
    private String uri;
    private String icon;
    private String redirectUri;
    private String grantTypes;
    private String appId;
}
