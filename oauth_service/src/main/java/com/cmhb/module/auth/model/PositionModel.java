package com.cmhb.module.auth.model;

import lombok.Data;
import net.sf.oval.constraint.NotNull;

import java.util.List;

@Data
public class PositionModel {
    @NotNull(message = "部门编号不能为空")
    private Long departmentId;
    private Long id;
    private String name;

    //该岗位下需要注销的用户列表
    private List<Long> userIds;
}
