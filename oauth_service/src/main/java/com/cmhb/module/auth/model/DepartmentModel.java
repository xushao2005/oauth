package com.cmhb.module.auth.model;

import lombok.Data;

import java.util.List;

@Data
public class DepartmentModel {
    private Long id;
    private String name;
    private String description;
    private Integer seq;
    private List<Long> userIds;
    private Long clientId;
    private List<Long> menuIds;
}
