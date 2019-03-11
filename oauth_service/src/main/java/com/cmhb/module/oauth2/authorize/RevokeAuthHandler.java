package com.cmhb.module.oauth2.authorize;

import com.cmhb.common.utils.BeanProvider;
import com.cmhb.common.utils.WebUtils;
import com.cmhb.module.auth.domain.AccessToken;
import com.cmhb.module.auth.service.AccessTokenService;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by luxp on 2017/6/6.
 */
public class RevokeAuthHandler {
    public static final Logger LOGGER = LoggerFactory.getLogger(RevokeAuthHandler.class);

    protected HttpServletResponse response;

    private AccessTokenService accessTokenService = BeanProvider.getBean(AccessTokenService.class);

    public RevokeAuthHandler(HttpServletResponse response) {
        this.response = response;
    }

    public void handle(String tokenCode) throws OAuthSystemException, ServletException, IOException {
        OAuthResponse oAuthResponse;
        if (accessTokenService.checkToken(tokenCode)) {
            AccessToken accessToken = new AccessToken();
            accessToken.setAccessToken(tokenCode);
            accessTokenService.deleteUserToken(accessToken);
            LOGGER.debug("delete accessToken: {}", accessToken);
            oAuthResponse = logout();
        } else {
            oAuthResponse = OAuthResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                    .setError(OAuthError.CodeResponse.INVALID_REQUEST)
                    .setErrorDescription("Invalid access_token")
                    .buildJSONMessage();
            LOGGER.debug("Invalid access_token: {}", tokenCode);
        }
        WebUtils.writeOAuthJsonResponse(response, oAuthResponse);
    }

    private OAuthResponse logout() throws OAuthSystemException {
        Subject subject = SecurityUtils.getSubject();
        try {
            LOGGER.debug("{} logout", subject.getPrincipal());
            subject.logout();
        } catch (Exception e) {
            LOGGER.debug("Encountered session exception during logout.  This can generally safely be ignored.", e);
            return OAuthResponse.errorResponse(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                    .setError("logout fail")
                    .setErrorDescription("Encountered session exception during logout.  This can generally safely be ignored. " + e)
                    .buildJSONMessage();
        }
        return OAuthResponse
                .status(HttpServletResponse.SC_OK)
                .buildJSONMessage();

    }
}
