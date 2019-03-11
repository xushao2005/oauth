package com.cmhb.common.shiro.realm;

import com.cmhb.common.shiro.ShiroUser;
import com.cmhb.common.shiro.cache.ShiroCacheHelper;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.service.PermissionService;
import com.cmhb.module.auth.service.UserService;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

public class UserRealm extends AuthorizingRealm implements InitializingBean {
    public static final Logger LOGGER = LoggerFactory.getLogger(UserRealm.class);

    @Autowired
    private UserService userService;
    @Autowired
    private PermissionService permissionService;

    /**
     * 注入工具类
     *
     * @throws Exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        ShiroCacheHelper.setUserRealm(this);
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        ShiroUser shiroUser = (ShiroUser) principals.getPrimaryPrincipal();

        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        // 读取用户的权限信息
        Set<String> perms = permissionService.findPermsPathByUser(shiroUser.getId());
        LOGGER.info("用户[{}]拥有认证中心权限:{}", shiroUser.getLoginName(), perms);
        info.addStringPermissions(perms);
        return info;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) throws AuthenticationException {
        val token = (UsernamePasswordToken) authcToken;
        User user = userService.getByLoginName(token.getUsername());

        //没找到帐号
        if (user == null) {
            LOGGER.info("用户不存在");
            throw new UnknownAccountException();
        }
        // 账号锁定
        if (!user.getDutyStatus()) {
            LOGGER.info("用户[{}]已离职。", user.getLoginName());
            throw new DisabledAccountException();
        }
        if (StringUtils.isBlank(user.getPassword())) {
            LOGGER.error("密码不能为空");
            throw new CredentialsException();
        }

        LOGGER.info("用户[{}]登录", user.getLoginName());
        ShiroUser shiroUser = new ShiroUser(user.getLoginName());
        shiroUser.setId(user.getId());
        shiroUser.setName(user.getUsername());
        return new SimpleAuthenticationInfo(
                shiroUser,
                user.getPassword(),
                getName()
        );
    }

    @Override
    protected Object getAuthenticationCacheKey(AuthenticationToken token) {
        return super.getAuthenticationCacheKey(token);
    }

    /**
     * loginName作为授权缓存key
     *
     * @param principals principals
     *
     * @return
     */
    @Override
    protected Object getAuthorizationCacheKey(PrincipalCollection principals) {
        ShiroUser shiroUser = (ShiroUser) super.getAuthenticationCacheKey(principals);
        return shiroUser.getLoginName();
    }

    /**
     * logiName作为认证缓存key
     * 与getAuthenticationCacheKey(${{@link AuthenticationToken}})保持一致
     *
     * @param principals
     *
     * @return
     */
    @Override
    protected Object getAuthenticationCacheKey(PrincipalCollection principals) {
        ShiroUser shiroUser = (ShiroUser) super.getAuthenticationCacheKey(principals);
        return shiroUser.getLoginName();
    }

    @Override
    public void clearCachedAuthorizationInfo(PrincipalCollection principals) {
        if (LOGGER.isInfoEnabled()) {
            ShiroUser shiroUser = (ShiroUser) principals.getPrimaryPrincipal();
            LOGGER.info("清除用户[{}]授权信息缓存", shiroUser.getLoginName());
        }

        super.clearCachedAuthorizationInfo(principals);
    }

    @Override
    public void clearCachedAuthenticationInfo(PrincipalCollection principals) {
        if (LOGGER.isInfoEnabled()) {
            ShiroUser shiroUser = (ShiroUser) principals.getPrimaryPrincipal();
            LOGGER.info("清除用户[{}]认证信息缓存", shiroUser.getLoginName());
        }

        super.clearCachedAuthenticationInfo(principals);
    }

    @Override
    public void clearCache(PrincipalCollection principals) {
        if (LOGGER.isInfoEnabled()) {
            ShiroUser shiroUser = (ShiroUser) principals.getPrimaryPrincipal();
            LOGGER.info("清除用户[{}]缓存", shiroUser.getLoginName());
        }
        clearCachedAuthorizationInfo(principals);
        clearCachedAuthenticationInfo(principals);
    }

    /**
     * 清除服务器所有授权缓存
     */
    public void clearAllCachedAuthorizationInfo() {
        LOGGER.info("清除所有授权缓存");
        if (LOGGER.isDebugEnabled()) {
            if (isAuthorizationCachingEnabled()) {
                Cache<Object, AuthorizationInfo> cache = getAuthorizationCache();
                for (Object key : cache.keys()) {
                    LOGGER.debug("clear AuthorizationCache:");
                    LOGGER.debug("{} = {}", key, cache.get(key));
                }
            }
        }
        getAuthorizationCache().clear();
    }

    /**
     * 清除服务器所有认证缓存
     */
    public void clearAllCachedAuthenticationInfo() {
        LOGGER.info("清除所有认证缓存");
        if (LOGGER.isDebugEnabled()) {
            if (isAuthenticationCachingEnabled()) {
                Cache<Object, AuthenticationInfo> cache = getAuthenticationCache();
                for (Object key : cache.keys()) {
                    LOGGER.debug("clear AuthenticationCache:");
                    LOGGER.debug("{} = {}", key, cache.get(key));
                }
            }
        }
        getAuthenticationCache().clear();
    }

    public void clearAllCache() {
        LOGGER.info("清除所有缓存");
        clearAllCachedAuthenticationInfo();
        clearAllCachedAuthorizationInfo();
    }
}
