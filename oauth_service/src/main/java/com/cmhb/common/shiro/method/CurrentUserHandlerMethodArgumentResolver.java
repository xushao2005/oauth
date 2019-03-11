package com.cmhb.common.shiro.method;


import com.cmhb.common.annotation.CurrentUser;
import com.cmhb.common.shiro.ShiroUser;
import com.cmhb.module.auth.domain.AccessToken;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.service.AccessTokenService;
import com.cmhb.module.auth.service.UserService;
import org.apache.shiro.SecurityUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolverComposite;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.annotation.Resource;
import java.lang.annotation.Annotation;

// 获取当前登录用户对象
public class CurrentUserHandlerMethodArgumentResolver extends HandlerMethodArgumentResolverComposite {
    @Resource
    private AccessTokenService accessTokenService;
    @Resource
    private UserService userService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        Class<?> klass = parameter.getParameterType();
        if (klass.isAssignableFrom(ShiroUser.class) || klass.isAssignableFrom(Long.class)) {
            Annotation[] as = parameter.getParameterAnnotations();
            for (Annotation a : as) {
                if (a.annotationType() == CurrentUser.class) {
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
        ShiroUser user = (ShiroUser) SecurityUtils.getSubject().getPrincipal();
        if (user == null) {
            user = resolveToken(webRequest);
        }

        if (klass.isAssignableFrom(ShiroUser.class)) {
            return user;
        } else if (klass.isAssignableFrom(Long.class)) {
            return user != null ? user.getId() : null;
        } else {
            throw new RuntimeException("认证失败");
        }
    }

    /**
     * 解析token获取用户
     *
     * @param webRequest
     *
     * @return
     */
    private ShiroUser resolveToken(NativeWebRequest webRequest) {
        String tokenCode = null;
        if (webRequest.getHeader("Authorization") != null) {
            tokenCode = webRequest.getHeader("Authorization");
        } else if (webRequest.getParameter("Authorization") != null) {
            tokenCode = webRequest.getParameter("Authorization");
        } else {
//            throw new RuntimeException("认证失败");
            return null;
        }

        AccessToken accessToken = accessTokenService.checkAndGetAccessToken(tokenCode);
        if (accessToken == null || accessToken.getUserId() == null) {
            return null;
        }

        User user = userService.findUser(accessToken.getUserId());
        if (user == null) {
            return null;
        }
        return new ShiroUser(user.getId(), user.getLoginName(), user.getUsername());
    }

}
