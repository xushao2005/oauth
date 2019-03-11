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
package com.cmhb.module.oauth2.token;

import com.cmhb.common.utils.WebUtils;
import com.cmhb.module.auth.domain.AccessToken;
import com.cmhb.module.oauth2.OAuthTokenxRequest;
import com.cmhb.module.oauth2.validator.AbstractClientDetailsValidator;
import com.cmhb.module.oauth2.validator.AuthorizationCodeClientDetailsValidator;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 2015/7/3
 * <p/>
 * grant_type=authorization_code
 *
 * @author Shengzhao Li
 */
public class AuthorizationCodeTokenHandler extends AbstractOAuthTokenHandler {

    private static final Logger LOG = LoggerFactory.getLogger(AuthorizationCodeTokenHandler.class);

    @Override
    public boolean support(OAuthTokenxRequest tokenRequest) throws OAuthProblemException {
        final String grantType = tokenRequest.getGrantType();
        return GrantType.AUTHORIZATION_CODE.toString().equalsIgnoreCase(grantType);
    }

    /*
    *
    * /oauth2/token?client_id=unity-client&client_secret=unity&grant_type=authorization_code&code=zLl170&redirect_uri=redirect_uri
    * */
    @Override
    public void handleAfterValidation() throws OAuthProblemException, OAuthSystemException {

        //response token, always new
        responseToken();

        //remove code lastly
        removeCode();
    }

    /**
     * 生成tokenCode后删除code
     */
    private void removeCode() {
        final String code = tokenRequest.getCode();
        oAuthService.removeAuthCode(code);
        LOG.debug("Remove code: {}", code);
    }

    private void responseToken() throws OAuthSystemException {
        String loginName = oAuthService.getUsernameByAuthCode(tokenRequest.getCode());
        AccessToken accessToken = accessTokenService.retrieveAccessToken(clientDetails(), loginName);
        final OAuthResponse tokenResponse = createTokenResponse(accessToken, false);

        LOG.debug("'authorization_code' response: {}", tokenResponse);
        WebUtils.writeOAuthJsonResponse(response, tokenResponse);
    }

    @Override
    protected AbstractClientDetailsValidator getValidator() {
        return new AuthorizationCodeClientDetailsValidator(tokenRequest);
    }

}
