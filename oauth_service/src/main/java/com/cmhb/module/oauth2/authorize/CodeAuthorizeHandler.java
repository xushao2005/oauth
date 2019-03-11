package com.cmhb.module.oauth2.authorize;

import com.alibaba.fastjson.JSONObject;
import com.cmhb.common.utils.BeanProvider;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.service.OAuthService;
import com.cmhb.module.oauth2.OAuthAuthxRequest;
import com.cmhb.module.oauth2.model.Result;
import com.cmhb.module.oauth2.validator.AbstractClientDetailsValidator;
import com.cmhb.module.oauth2.validator.CodeClientDetailsValidator;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;

/**
 * 2015/6/25
 * <p/>
 * Handle response_type = 'code'
 *
 * @author Shengzhao Li
 */
public class CodeAuthorizeHandler extends AbstractAuthorizeHandler {

    private static final Logger LOG = LoggerFactory.getLogger(CodeAuthorizeHandler.class);


    private OAuthService oAuthService = BeanProvider.getBean(OAuthService.class);

    public CodeAuthorizeHandler(OAuthAuthxRequest oauthRequest, HttpServletResponse response) {
        super(oauthRequest, response);
    }

    @Override
    protected AbstractClientDetailsValidator getValidator() {
        return new CodeClientDetailsValidator(oauthRequest);
    }

    //response code
    @Override
    protected Result handleResponse() throws OAuthSystemException {
        Result result = new Result();
        JSONObject authorizeCode = new JSONObject();
        final Client clientDetails = clientDetails();
        String authCode = oAuthService.retrieveAuthCode(oauthRequest.getParam(OAuth.OAUTH_RESPONSE_TYPE));

        authorizeCode.put("redirectUri", clientDetails.getRedirectUri());
        authorizeCode.put("code", authCode);
        result.setSuccessful(true);
        result.setCode(302);
        result.setResult(authorizeCode);
        LOG.debug(" 'code' response: {}", result);
        return result;
    }

}
