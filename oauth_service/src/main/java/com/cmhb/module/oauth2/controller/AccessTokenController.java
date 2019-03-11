package com.cmhb.module.oauth2.controller;

import com.cmhb.common.utils.WebUtils;
import com.cmhb.module.oauth2.OAuthTokenxRequest;
import com.cmhb.module.oauth2.token.OAuthTokenHandleDispatcher;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class AccessTokenController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AccessTokenController.class);
    /**
     * Handle grant_types as follows:
     * <p/>
     * grant_type=authorization_code
     * grant_type=password
     * grant_type=refresh_token
     * grant_type=client_credentials
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @throws OAuthSystemException
     */
    @RequestMapping("accessToken")
    public void authorize(HttpServletRequest request, HttpServletResponse response) throws OAuthSystemException {
        try {
            OAuthTokenxRequest tokenRequest = new OAuthTokenxRequest(request);

            OAuthTokenHandleDispatcher tokenHandleDispatcher = new OAuthTokenHandleDispatcher(tokenRequest, response);
            tokenHandleDispatcher.dispatch();

        } catch (OAuthProblemException e) {
            LOGGER.error("accessToken exception", e);
            //exception
            OAuthResponse oAuthResponse = OAuthASResponse
                    .errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                    .error(e)
                    .buildJSONMessage();
            WebUtils.writeOAuthJsonResponse(response, oAuthResponse);
        } catch (Exception e) {
            LOGGER.error("accessToken exception", e);
            OAuthResponse oAuthResponse = OAuthASResponse
                    .errorResponse(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                    .setErrorDescription(e.getMessage())
                    .buildJSONMessage();
            WebUtils.writeOAuthJsonResponse(response, oAuthResponse);
        }

    }


}
