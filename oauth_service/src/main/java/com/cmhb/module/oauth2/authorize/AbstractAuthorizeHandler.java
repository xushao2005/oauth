package com.cmhb.module.oauth2.authorize;

import com.cmhb.common.Constants;
import com.cmhb.common.exceptions.OAuthException;
import com.cmhb.common.utils.WebUtils;
import com.cmhb.module.oauth2.OAuthAuthxRequest;
import com.cmhb.module.oauth2.OAuthHandler;
import com.cmhb.module.oauth2.model.Result;
import com.cmhb.module.oauth2.validator.AbstractClientDetailsValidator;
import lombok.extern.slf4j.Slf4j;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 2015/6/25
 *
 * @author Shengzhao Li
 */
@Slf4j
public abstract class AbstractAuthorizeHandler extends OAuthHandler {

    protected OAuthAuthxRequest oauthRequest;
    protected HttpServletResponse response;

    public AbstractAuthorizeHandler(OAuthAuthxRequest oauthRequest, HttpServletResponse response) {
        this.oauthRequest = oauthRequest;
        this.response = response;
    }


    protected void validateFailed() throws OAuthException {
        AbstractClientDetailsValidator validator = getValidator();
        log.debug("Use [{}] validate client: {}", validator, oauthRequest.getClientId());

        validator.validate();
    }

    protected abstract AbstractClientDetailsValidator getValidator();

    protected boolean checkAndResponseValidateFailed(OAuthResponse oAuthResponse) {
        if (oAuthResponse != null) {
            log.debug("Validate OAuthAuthzRequest(client_id={}) failed", oauthRequest.getClientId());
            WebUtils.writeOAuthJsonResponse(response, oAuthResponse);
            return true;
        }
        return false;
    }

    @Override
    protected String clientId() {
        return oauthRequest.getClientId();
    }

    protected boolean isUserAuthenticated() {
        final Subject subject = SecurityUtils.getSubject();
        return subject.isAuthenticated();
    }

    protected boolean isNeedUserLogin() {
        return !isUserAuthenticated() && !isPost();
    }

    protected void responseApprovalDeny() throws IOException, OAuthSystemException {

        final OAuthResponse oAuthResponse = OAuthASResponse.errorResponse(HttpServletResponse.SC_FOUND)
                .setError(OAuthError.CodeResponse.ACCESS_DENIED)
                .setErrorDescription("User denied access")
                .location(clientDetails().getRedirectUri())
                .setState(oauthRequest.getState())
                .buildQueryMessage();
        log.debug("'ACCESS_DENIED' response: {}", oAuthResponse);

        WebUtils.writeOAuthQueryResponse(response, oAuthResponse);

        //user logout when deny
        final Subject subject = SecurityUtils.getSubject();
        subject.logout();
        log.debug("After 'ACCESS_DENIED' call logout. user: {}", subject.getPrincipal());
    }

    @Deprecated
    protected boolean goLogin() throws ServletException, IOException {
        if (isNeedUserLogin()) {
            //go to login
            log.debug("Forward to Oauth login by client_id '{}'", oauthRequest.getClientId());
            final HttpServletRequest request = oauthRequest.request();
            request.getRequestDispatcher(Constants.OAUTH_LOGIN_VIEW)
                    .forward(request, response);
            return true;
        }
        return false;
    }

    protected boolean isPost() {
        return RequestMethod.POST.name().equalsIgnoreCase(oauthRequest.request().getMethod());
    }

    public Result handle() throws OAuthException, OAuthSystemException {
        Result result = new Result();
        //validate
        validateFailed();

        //Check need usr login
        if (!isUserAuthenticated()) {
            result.setSuccessful(false);
            result.setMsg("未认证");
            result.setCode(4200);
            return result;
        }

        //handle response
        return handleResponse();
    }

    //Handle custom response content
    protected abstract Result handleResponse() throws OAuthSystemException;
}
