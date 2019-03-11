package com.cmhb.common.resolver;

import com.cmhb.common.annotation.TokenClient;
import com.cmhb.common.shiro.ShiroUser;
import com.cmhb.module.auth.domain.AccessToken;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.service.AccessTokenService;
import com.cmhb.module.auth.service.ClientService;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolverComposite;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.annotation.Resource;
import java.lang.annotation.Annotation;

/**
 * controller参数注入client
 * Created by luxp on 2017/8/22.
 */
public class ClientHandlerMethodArgumentResolver extends HandlerMethodArgumentResolverComposite {
    @Resource
    private AccessTokenService accessTokenService;
    @Resource
    private ClientService clientService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        Class<?> klass = parameter.getParameterType();
        if (klass.isAssignableFrom(ShiroUser.class) || klass.isAssignableFrom(Long.class)) {
            Annotation[] as = parameter.getParameterAnnotations();
            for (Annotation a : as) {
                if (a.annotationType() == TokenClient.class) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {
        Class<?> klass = parameter.getParameterType();
        String tokenCode = null;
        if (webRequest.getHeader("Authorization") != null) {
            tokenCode = webRequest.getHeader("Authorization");
        } else if (webRequest.getParameter("Authorization") != null) {
            tokenCode = webRequest.getParameter("Authorization");
        } else {
            throw new RuntimeException("认证失败");
        }

        AccessToken accessToken = accessTokenService.checkAndGetAccessToken(tokenCode);
        if (accessToken == null || accessToken.getUserId() == null) {
            return null;
        }

        Client client = clientService.findByClientSecret(accessToken.getClientSecret());
        if (client == null) {
            return null;
        }

        if (klass.isAssignableFrom(ShiroUser.class)) {
            return client;
        } else if (klass.isAssignableFrom(Long.class)) {
            return client != null ? client.getId() : null;
        } else {
            throw new RuntimeException("认证失败");
        }
    }
}
