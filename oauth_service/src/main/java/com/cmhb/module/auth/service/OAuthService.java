package com.cmhb.module.auth.service;

import com.cmhb.common.shiro.ShiroUser;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuer;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.ResponseType;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

/**
 * <p>User: Zhang Kaitao
 * <p>Date: 14-2-17
 * <p>Version: 1.0
 */
@Service
public class OAuthService {
    private Cache cache;

    @Autowired
    private ClientService clientService;
    @Autowired
    private OAuthIssuer oAuthIssuer;

    @Autowired
    public OAuthService(CacheManager cacheManager) {
        this.cache = cacheManager.getCache("code-cache");
    }

    /**
     * 生成grantCode
     *
     * @param responseType
     *
     * @return
     */
    public String retrieveAuthCode(String responseType) throws OAuthSystemException {
        Subject subject = SecurityUtils.getSubject();
        ShiroUser shiroUser = (ShiroUser) subject.getPrincipal();
        //生成授权码
        String authCode = null;
        if (responseType.equals(ResponseType.CODE.toString())) {
            authCode = oAuthIssuer.authorizationCode();
            addAuthCode(authCode, shiroUser.getLoginName());
        }
        return authCode;
    }

    public void addAuthCode(String authCode, String username) {
        cache.put(authCode, username);
    }

    public void removeAuthCode(String authCode) {
        cache.evict(authCode);
    }

    public void addAccessToken(String accessToken, String username) {
        cache.put(accessToken, username);
    }

    public String getUsernameByAuthCode(String authCode) {
        Cache.ValueWrapper valueWrapper = cache.get(authCode);
        if (valueWrapper == null) {
            return null;
        }
        return (String) valueWrapper.get();
    }

    public String getUsernameByAccessToken(String accessToken) {
        return (String) cache.get(accessToken).get();
    }

    public boolean checkAuthCode(String authCode) {
        return cache.get(authCode) != null;
    }

    public boolean checkAccessToken(String accessToken) {
        return cache.get(accessToken) != null;
    }

    public boolean checkAppId(String appId) {
        return clientService.findByAppId(appId) != null;
    }

    public boolean checkClientSecret(String clientSecret) {
        return clientService.findByClientSecret(clientSecret) != null;
    }

    public long getExpireIn() {
        return 3600L;
    }

}
