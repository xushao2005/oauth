package com.cmhb.module.auth.enums;

import com.cmhb.common.exceptions.ServiceException;

/**
 * Created by luxp on 2017/8/8.
 */
public enum ResourceType {
    //todo 为什么分api和action
    //todo 按钮有什么用
    API(0, "api调用权限"),
    MENU(1, "菜单，页面显示权限"),
    BUTTON(2, "按钮"),
    ALL(-1, "所有");

    public int code;
    public String remark;

    ResourceType(int code, String remark) {
        this.code = code;
        this.remark = remark;
    }

    public static int convert(String name) {
        ResourceType[] values = ResourceType.values();
        for (ResourceType value : values) {
            if (value.name().toLowerCase().equals(name)) {
                return value.code;
            }
        }
        throw new ServiceException("不存在资源类型[" + name + "]");
    }
}
