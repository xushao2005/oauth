package com.cmhb.common.mybatisplus;

import lombok.val;
import org.apache.ibatis.reflection.MetaObject;

import java.time.LocalDateTime;

public class MetaObjectHandler extends com.baomidou.mybatisplus.mapper.MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        val now = LocalDateTime.now();
        insertIfHasProperty(metaObject, "addTime", now, false);
        insertIfHasProperty(metaObject, "createTime", now, false);
        insertIfHasProperty(metaObject, "modTime", now, false);
        insertIfHasProperty(metaObject, "modifyTime", now, false);
        //默认删除状态
        insertIfHasProperty(metaObject, "status", 1, false);
        insertIfHasProperty(metaObject, "deleteFlag", false, false);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        val now = LocalDateTime.now();
        insertIfHasProperty(metaObject, "modTime", now, true);
        insertIfHasProperty(metaObject, "modifyTime", now, true);
    }

    private void insertIfHasProperty(MetaObject metaObject, String property, Object value, boolean override) {
        if (metaObject.hasGetter(property)) {
            val oldValue = metaObject.getValue(property);
            if (override || oldValue == null) {
                metaObject.setValue(property, value);
            }
        }
    }
}
