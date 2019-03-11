package com.cmhb.module.auth.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

/**
 * 控件资源节点
 * 用于控件导入
 *
 * @author luxp
 * Created by luxp on 2017/9/29.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ControlNode extends ControlModel {
    private List<ControlNode> children;
}
