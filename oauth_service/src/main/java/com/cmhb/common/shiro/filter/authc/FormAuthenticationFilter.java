package com.cmhb.common.shiro.filter.authc;

import com.cmhb.common.utils.JsonUtils;
import com.cmhb.module.auth.domain.User;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;

import javax.servlet.ServletInputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by luxp on 2017/8/7.
 */
@Slf4j
public class FormAuthenticationFilter extends org.apache.shiro.web.filter.authc.FormAuthenticationFilter {

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        val httpResponse = (HttpServletResponse) response;
        if (this.isLoginRequest(request, response)) {
            if (this.isLoginSubmission(request, response)) {
                return this.executeLogin(request, response);
            } else {
                httpResponse.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
                return false;
            }
        } else {
            httpResponse.setStatus(HttpServletResponse.SC_PROXY_AUTHENTICATION_REQUIRED);
            return false;
        }
    }

    @Override
    @SneakyThrows
    protected AuthenticationToken createToken(ServletRequest request, ServletResponse response) {
        int len = request.getContentLength();
        ServletInputStream in = request.getInputStream();
        byte[] buffer = new byte[len];
        in.read(buffer, 0, len);
        val requestBody = new String(buffer);
        val user = JsonUtils.parse(requestBody, User.class);
        String username = user.getLoginName();
        String password = user.getPassword();
        return this.createToken(username, password, request, response);
    }

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response) throws Exception {
        return false;
    }

    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
        val httpResponse = (HttpServletResponse) response;
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}
