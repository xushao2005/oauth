package com.cmhb.module.oauth2.validator;

import com.cmhb.common.exceptions.OAuthException;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.oauth2.OAuthAuthxRequest;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 获取code请求验证
 * <p>
 * 15-6-13
 *
 * @author Shengzhao Li
 */
public class CodeClientDetailsValidator extends AbstractClientDetailsValidator {

    private static final Logger LOG = LoggerFactory.getLogger(CodeClientDetailsValidator.class);

    public CodeClientDetailsValidator(OAuthAuthxRequest oauthRequest) {
        super(oauthRequest);
    }

    /*
    *  grant_type="authorization_code"
    *  ?response_type=code&scope=read,write&client_id=[client_id]&redirect_uri=[redirect_uri]&state=[state]
    * */
    @Deprecated
    @Override
    public OAuthResponse validateSelf(Client clientDetails) throws OAuthSystemException {
        //validate redirect_uri
        final String redirectURI = oauthRequest.getRedirectURI();
        if (redirectURI == null || !redirectURI.equals(clientDetails.getRedirectUri())) {
            LOG.debug("Invalid redirect_uri '{}' by response_type = 'code'", redirectURI);
            return invalidRedirectUriResponse();
        }

        final String appId = oauthRequest.getClientId();
        if (!appId.equals(clientDetails.getAppId())) {
            LOG.debug("Invalid client_id '{}' by response_type = 'code'", appId);
            return invalidClientErrorResponse();
        }

        //todo validate scope
        //region scope
//        final Set<String> scopes = oauthRequest.getScopes();
//        if (scopes.isEmpty() || excludeScopes(scopes, clientDetails)) {
//            return invalidScopeResponse();
//        }
        //endregion

        //todo validate state
//        final String state = getState();
//        if (StringUtils.isEmpty(state)) {
//            LOG.debug("Invalid 'state', it is required, but it is empty");
//            return invalidStateResponse();
//        }
        return null;
    }

    @Override
    public void validateSelf() throws OAuthException {
        Client clientDetails = clientDetails();
        // validate redirect_uri
        final String redirectURI = oauthRequest.getRedirectURI();
        if (redirectURI == null || !redirectURI.equals(clientDetails.getRedirectUri())) {
            String errorMsg = String.format("Invalid redirect_uri '%s' by response_type = 'code'", redirectURI);
            throw new OAuthException(errorMsg);
        }
        // validate client_id
        final String appId = oauthRequest.getClientId();
        if (!appId.equals(clientDetails.getAppId())) {
            String errorMsg = String.format("Invalid client_id '%s' by response_type = 'code'", appId);
            throw new OAuthException(errorMsg);
        }

        //todo validate scope
        //region scope
//        final Set<String> scopes = oauthRequest.getScopes();
//        if (scopes.isEmpty() || excludeScopes(scopes, clientDetails)) {
//            return invalidScopeResponse();
//        }
        //endregion

        //todo validate state
//        final String state = getState();
//        if (StringUtils.isEmpty(state)) {
//            LOG.debug("Invalid 'state', it is required, but it is empty");
//            return invalidStateResponse();
//        }
    }

    private String getState() {
        return ((OAuthAuthxRequest) oauthRequest).getState();
    }
}
