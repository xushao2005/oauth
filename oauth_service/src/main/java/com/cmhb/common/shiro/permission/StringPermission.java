package com.cmhb.common.shiro.permission;

import lombok.NonNull;
import lombok.val;
import org.apache.shiro.authz.Permission;
import org.springframework.util.StringUtils;

public class StringPermission implements Permission {
    private String permissionString;

    public StringPermission(@NonNull final String raw) {
        val permission = raw.trim();

        if (!StringUtils.hasText(permission)) {
            throw new IllegalArgumentException("Make sure permission strings are properly formatted.");
        } else {
            this.permissionString = permission;
        }
    }

    @Override
    public boolean implies(Permission permission) {
        return equals(permission);
    }

    @Override
    public String toString() {
        return permissionString;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof StringPermission) {
            StringPermission sp = (StringPermission) o;
            return permissionString.equals(sp.permissionString);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return permissionString.hashCode();
    }
}
