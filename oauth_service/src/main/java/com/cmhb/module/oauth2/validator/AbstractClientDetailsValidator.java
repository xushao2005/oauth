package com.cmhb.module.oauth2.validator;

import com.cmhb.common.exceptions.OAuthException;
import com.cmhb.common.utils.BeanProvider;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.service.AccessTokenService;
import com.cmhb.module.auth.service.ClientService;
import com.cmhb.module.auth.service.OAuthService;
import org.apache.oltu.oauth2.as.request.OAuthRequest;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.util.Set;

/**
 * 15-6-13
 * <p/>
 * 对各类 grant_type 的请求进行验证的公共类
 * 将通用的行为(方法) 位于此
 *
 * @author Shengzhao Li
 */
public abstract class AbstractClientDetailsValidator {

    private static final Logger LOG = LoggerFactory.getLogger(AbstractClientDetailsValidator.class);


    protected ClientService clientService = BeanProvider.getBean(ClientService.class);
    protected OAuthService oAuthService = BeanProvider.getBean(OAuthService.class);
    protected AccessTokenService accessTokenService = BeanProvider.getBean(AccessTokenService.class);

    protected OAuthRequest oauthRequest;

    private Client clientDetails;

    protected AbstractClientDetailsValidator(OAuthRequest oauthRequest) {
        this.oauthRequest = oauthRequest;
    }


    protected Client clientDetails() {
        if (clientDetails == null) {
            clientDetails = clientService.findByAppId(oauthRequest.getClientId());
        }
        return clientDetails;
    }


    protected OAuthResponse invalidClientErrorResponse() throws OAuthSystemException {
        return OAuthResponse.errorResponse(HttpServletResponse.SC_UNAUTHORIZED)
                .setError(OAuthError.TokenResponse.INVALID_CLIENT)
                .setErrorDescription("Invalid client_id '" + oauthRequest.getClientId() + "'")
                .buildJSONMessage();
    }

    protected OAuthResponse invalidRedirectUriResponse() throws OAuthSystemException {
        return OAuthResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                .setError(OAuthError.CodeResponse.INVALID_REQUEST)
                .setErrorDescription("Invalid redirect_uri '" + oauthRequest.getRedirectURI() + "'")
                .buildJSONMessage();
    }

    protected OAuthResponse invalidScopeResponse() throws OAuthSystemException {
        return OAuthResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                .setError(OAuthError.CodeResponse.INVALID_SCOPE)
                .setErrorDescription("Invalid scope '" + oauthRequest.getScopes() + "'")
                .buildJSONMessage();
    }


    public final void validate() throws OAuthException {
        final Client details = clientDetails();
        if (details == null) {
            throw new OAuthException("not exist client");
        }

        validateSelf();
    }

    public final OAuthResponse validateReturnRes() throws OAuthSystemException {
        final Client details = clientDetails();
        if (details == null) {
            return invalidClientErrorResponse();
        }

        return validateSelf(details);
    }


    protected boolean excludeScopes(Set<String> scopes, Client clientDetails) {
        //todo scope
//        final String clientDetailsScope = clientDetails.scope();          //read write
//        for (String scope : scopes) {
//            if (!clientDetailsScope.contains(scope)) {
//                LOG.debug("Invalid scope - ClientDetails scopes '{}' exclude '{}'", clientDetailsScope, scope);
//                return true;
//            }
//        }
        return false;
    }


    protected OAuthResponse invalidClientSecretResponse() throws OAuthSystemException {
        return OAuthResponse.errorResponse(HttpServletResponse.SC_UNAUTHORIZED)
                .setError(OAuthError.TokenResponse.UNAUTHORIZED_CLIENT)
                .setErrorDescription("Invalid client_secret by client_id '" + oauthRequest.getClientId() + "'")
                .buildJSONMessage();
    }

    private OAuthResponse invalidStateResponse() throws OAuthSystemException {
        return OAuthResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                .setError(OAuthError.CodeResponse.INVALID_REQUEST)
                .setErrorDescription("Parameter 'state'  is required")
                .buildJSONMessage();
    }

    protected abstract OAuthResponse validateSelf(Client clientDetails) throws OAuthSystemException;

    protected abstract void validateSelf() throws OAuthException;
}
