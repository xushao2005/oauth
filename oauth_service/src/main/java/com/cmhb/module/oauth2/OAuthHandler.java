package com.cmhb.module.oauth2;

import com.cmhb.common.utils.BeanProvider;
import com.cmhb.module.auth.domain.AccessToken;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.service.AccessTokenService;
import com.cmhb.module.auth.service.ClientService;
import com.cmhb.module.auth.service.OAuthService;
import org.apache.commons.lang.StringUtils;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;

/**
 * 2015/7/3
 * <p/>
 * 对OAUTH各种流程的操作进行抽象,
 * 将没用的行为(方法) 放于此
 *
 * @author Shengzhao Li
 */
public abstract class OAuthHandler {


    private static final Logger LOG = LoggerFactory.getLogger(OAuthHandler.class);

    protected transient ClientService clientService = BeanProvider.getBean(ClientService.class);

    protected transient OAuthService oAuthService = BeanProvider.getBean(OAuthService.class);

    protected transient AccessTokenService accessTokenService = BeanProvider.getBean(AccessTokenService.class);

    private Client clientDetails;


    protected Client clientDetails() {
        if (clientDetails == null) {
            final String clientId = clientId();
            clientDetails = clientService.findByAppId(clientId);
            LOG.debug("Load ClientDetails: {} by clientId: {}", clientDetails, clientId);
        }
        return clientDetails;
    }


    /**
     * Create  AccessToken response
     *
     * @param accessToken AccessToken
     * @param queryOrJson True is QueryMessage, false is JSON message
     *
     * @return OAuthResponse
     *
     * @throws org.apache.oltu.oauth2.common.exception.OAuthSystemException
     */
    protected OAuthResponse createTokenResponse(AccessToken accessToken, boolean queryOrJson) throws OAuthSystemException {
        final Client tempClientDetails = clientDetails();
        final OAuthASResponse.OAuthTokenResponseBuilder builder = OAuthASResponse
                .tokenResponse(HttpServletResponse.SC_OK)
                .location(tempClientDetails.getRedirectUri())
                .setAccessToken(accessToken.getAccessToken())
                .setExpiresIn(String.valueOf(AccessToken.ACCESS_TOKEN_VALIDITY_SECONDS))
                .setParam("userId", String.valueOf(accessToken.getUserId()));

        final String refreshToken = accessToken.getRefreshToken();
        if (StringUtils.isNotEmpty(refreshToken)) {
            builder.setRefreshToken(refreshToken);
        }

        return queryOrJson ? builder.buildQueryMessage() : builder.buildJSONMessage();
    }


    protected abstract String clientId();

}
