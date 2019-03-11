package com.cmhb.module.auth.model;

import lombok.Data;
import net.sf.oval.constraint.NotNull;

import java.util.List;

@Data
public class DutyModel {
    @NotNull(message = "岗位编码不能为空")
    private Long positionId;
    private Long id;
    private String name;

    private List<Long> userIds;
    private Long clientId;
    private List<Long> menuIds;
}
