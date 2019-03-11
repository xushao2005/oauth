/*
 * Copyright (c) 2013 Andaily Information Technology Co. Ltd
 * www.andaily.com
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Andaily Information Technology Co. Ltd ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement you
 * entered into with Andaily Information Technology Co. Ltd.
 */
package com.cmhb.module.oauth2.validator;

import com.cmhb.common.exceptions.OAuthException;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.oauth2.OAuthTokenxRequest;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;

/**
 * grant_type=authorization_code请求验证
 * 2015/7/3
 *
 * @author Shengzhao Li
 */
public class AuthorizationCodeClientDetailsValidator extends AbstractOauthTokenValidator {

    private static final Logger LOG = LoggerFactory.getLogger(AuthorizationCodeClientDetailsValidator.class);


    public AuthorizationCodeClientDetailsValidator(OAuthTokenxRequest oauthRequest) {
        super(oauthRequest);
    }

    /**
     * /oauth2/token?client_id=unity-client&client_secret=unity&grant_type=authorization_code&code=zLl170&redirect_uri=redirect_uri
     * @param clientDetails
     */
    @Override
    protected OAuthResponse validateSelf(Client clientDetails) throws OAuthSystemException {

        //todo validate grant_type
//        final String grantType = grantType();
//        if (!clientDetails.grantTypes().contains(grantType)) {
//            LOG.debug("Invalid grant_type '{}', client_id = '{}'", grantType, clientDetails.getAppId());
//            return invalidGrantTypeResponse(grantType);
//        }

        //validate client_secret
        final String clientSecret = oauthRequest.getClientSecret();
        if (clientSecret == null || !clientSecret.equals(clientDetails.getSecretKey())) {
            LOG.debug("Invalid client_secret '{}', client_id = '{}'", clientSecret, clientDetails.getAppId());
            return invalidClientSecretResponse();
        }


        //validate redirect_uri
        final String redirectURI = oauthRequest.getRedirectURI();
        if (redirectURI == null || !redirectURI.equals(clientDetails.getRedirectUri())) {
            LOG.debug("Invalid redirect_uri '{}', client_id = '{}'", redirectURI, clientDetails.getAppId());
            return invalidRedirectUriResponse();
        }

        //validate code
        String code = getCode();
        if (!oAuthService.checkAuthCode(code)) {
            LOG.debug("Invalid code '{}', client_id = '{}'", code, clientDetails.getAppId());
            return invalidCodeResponse(code);
        }

        return null;
    }

    @Override
    protected void validateSelf() throws OAuthException {

    }

    private OAuthResponse invalidCodeResponse(String code) throws OAuthSystemException {
        return OAuthResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                .setError(OAuthError.TokenResponse.INVALID_GRANT)
                .setErrorDescription("Invalid code '" + code + "'")
                .buildJSONMessage();
    }

    private String getCode() {
        return ((OAuthTokenxRequest) oauthRequest).getCode();
    }
}
