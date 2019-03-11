package com.cmhb.module.oauth2.model;

import lombok.Data;

/**
 * Created by luxp on 2017/6/1.
 */
@Data
public class UserDto {
    private String id;
    private String loginName;
    private String username;
    private transient String password;
    private transient String passwordAgain;

}
