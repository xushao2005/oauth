package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.AccessTokenDao;
import com.cmhb.module.auth.domain.AccessToken;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.domain.User;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuer;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * ${table.comment} 服务类
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
@Service
public class AccessTokenService extends ServiceImpl<AccessTokenDao, AccessToken> {
    public static final Logger LOGGER = LoggerFactory.getLogger(AccessTokenService.class);

    @Autowired
    private AccessTokenDao accessTokenDao;
    @Autowired
    private OAuthIssuer oAuthIssuer;
    @Autowired
    private UserService userService;

    /**
     * 重新生成token
     *
     * @param clientDetail 应用信息
     * @param loginName 登录名
     * @return
     * @throws OAuthSystemException
     */

    public AccessToken retrieveAccessToken(Client clientDetail, String loginName) throws OAuthSystemException {
        User user = userService.getByLoginName(loginName);
        String secret = clientDetail.getSecretKey();
        Long userId = user.getId();

        //删除存在的token
        List<AccessToken> accessTokens = selectExistToken(secret, userId);
        for (AccessToken accessToken : accessTokens) {
            LOGGER.debug("Delete exist accessToken: {}", accessToken);
            deleteUserToken(accessToken);
        }

        //生成新token
        AccessToken newAccessToken = createAndSaveAccessToken(userId, secret);
        LOGGER.debug("Create a new accessToken: {}", newAccessToken);
        return newAccessToken;
    }

    /**
     * 应用下用户的token
     *
     * @param secret 应用ssecretKey
     * @param userId userId
     *
     * @return
     */
    private List<AccessToken> selectExistToken(String secret, Long userId) {
        List<AccessToken> accessTokens = accessTokenDao.findByUser(userId, secret);
        if (accessTokens == null) {
            accessTokens = new ArrayList<AccessToken>();
        }
        return accessTokens;
    }
    /**
     * 刷新token
     *
     * @param refreshToken refreshToken
     * @return
     */

    public AccessToken loadAccessTokenByRefreshToken(String refreshToken) {
        return accessTokenDao.findByRefreshToken(refreshToken);
    }


    public void deleteUserToken(AccessToken accessToken) {
        Wrapper<AccessToken> wrapper = new EntityWrapper<AccessToken>(accessToken);
        super.delete(wrapper);
    }


    public AccessToken createAndSaveAccessToken(Long userId, String secret) throws OAuthSystemException {
        AccessToken accessToken = new AccessToken();
        final String tokenCode = oAuthIssuer.accessToken();
        final String refreshTokenCode = oAuthIssuer.refreshToken();
        accessToken.setUserId(userId);
        accessToken.setClientSecret(secret);
        accessToken.setAccessToken(tokenCode);
        accessToken.setRefreshToken(refreshTokenCode);
        LocalDateTime expiredTime = getExpiredTime();
        accessToken.setAccessTokenExpiredTime(expiredTime);
        accessToken.setRefreshTokenExpiredTime(expiredTime);
        super.insert(accessToken);
        return accessToken;
    }


    public boolean checkToken(String token) {
        AccessToken accessToken = accessTokenDao.findByToken(token);
        if (accessToken == null) {
            return false;
        }
        LocalDateTime expiredTime = accessToken.getAccessTokenExpiredTime();
        if (!expiredTime.isAfter(LocalDateTime.now())) {
            return false;
        }
        return true;
    }


    public AccessToken refreshToken(String refreshToken) throws OAuthSystemException {
        AccessToken accessToken = accessTokenDao.findByRefreshToken(refreshToken);
        final String tokenCode = oAuthIssuer.accessToken();
        final String refreshTokenCode = oAuthIssuer.refreshToken();
        accessToken.setAccessToken(tokenCode);
        accessToken.setRefreshToken(refreshTokenCode);
        LocalDateTime expiredTime = getExpiredTime();
        accessToken.setAccessTokenExpiredTime(expiredTime);
        accessToken.setRefreshTokenExpiredTime(expiredTime);
        super.updateById(accessToken);
        return accessToken;
    }

    LocalDateTime getExpiredTime() {
        LocalDateTime exprTime = LocalDateTime.now();
        return exprTime.plusDays(30);
    }

    public AccessToken checkAndGetAccessToken(String accessToken) {
        if (StringUtils.isBlank(accessToken)) {
            LOGGER.debug("accessToken为空.");
            throw new IllegalArgumentException("accessToken为空.");
        }

        val param = new AccessToken();
        param.setAccessToken(accessToken);
        Wrapper<AccessToken> wrapper = new EntityWrapper<>(param);
        AccessToken token = selectOne(wrapper);

        if (token == null) {
            LOGGER.error("Token不存在. tokenCode={}", accessToken);
            throw new IllegalArgumentException("错误tokenCode");
        }
        return token;
    }
}
