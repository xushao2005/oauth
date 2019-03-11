package com.cmhb.module.auth.model;

import lombok.Data;

import java.util.List;

@Data
public class ControlRoot {
    private String appId;
    private List<ControlNode> menus;
}
