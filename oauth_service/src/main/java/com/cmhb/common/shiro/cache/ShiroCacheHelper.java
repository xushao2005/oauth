package com.cmhb.common.shiro.cache;

import com.cmhb.common.shiro.ShiroUser;
import com.cmhb.common.shiro.realm.UserRealm;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;

/**
 * shiro缓存工具
 *
 * @author luxp
 * @date 2017/12/19
 */
public abstract class ShiroCacheHelper {
    private static final String TEMP_REALM_NAME = "temp_realm";

    private static UserRealm userRealm;

    public static void setUserRealm(UserRealm userRealm) {
        ShiroCacheHelper.userRealm = userRealm;
    }

    private static void clearCachedAuthorizationInfo(PrincipalCollection principals) {
        userRealm.clearCachedAuthorizationInfo(principals);
    }

    public static void clearCachedAuthenticationInfo(PrincipalCollection principals) {
        userRealm.clearCachedAuthenticationInfo(principals);
    }

    public static void clearCachedAuthorizationInfo(String loginName) {
        clearCachedAuthorizationInfo(getPrincipalCollection(loginName));
    }

    public static void clearCachedAuthenticationInfo(String loginName) {
        clearCachedAuthenticationInfo(getPrincipalCollection(loginName));
    }

    private static PrincipalCollection getPrincipalCollection(String loginName) {
        if (StringUtils.isBlank(loginName)) {
            throw new IllegalArgumentException("参数错误");
        }

        ShiroUser shiroUser = new ShiroUser(loginName);
        return new SimplePrincipalCollection(shiroUser, TEMP_REALM_NAME);
    }
}
