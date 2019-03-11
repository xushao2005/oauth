package com.cmhb.module.auth.model;

import lombok.Data;

import java.util.List;

/**
 * Created by luxp on 2017/8/10.
 */
@Data
public class RoleModel {
    private Long id;
    private String name;
    private String description;
    private List<Long> userIds;
    private Long clientId;
    private List<Long> menuIds;
}
