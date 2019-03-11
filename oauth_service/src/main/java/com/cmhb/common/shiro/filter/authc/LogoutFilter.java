package com.cmhb.common.shiro.filter.authc;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.session.SessionException;
import org.apache.shiro.subject.Subject;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * @author 王增理
 * @create 2017-07-17
 */
@Slf4j
@Data
public class LogoutFilter extends org.apache.shiro.web.filter.authc.LogoutFilter {
    public static final String DEFAULT_ERROR_KEY_ATTRIBUTE_NAME = "shiroLogoutFailure";

    private String failureKeyAttribute = DEFAULT_ERROR_KEY_ATTRIBUTE_NAME;

    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        Subject subject = getSubject(request, response);

        try {
            subject.logout();
        } catch (SessionException ise) {
            log.debug("Encountered session exception during logout.  This can generally safely be ignored.", ise);
            setFailureAttribute(request, ise);
        }
        return false;
    }

    protected void setFailureAttribute(ServletRequest request, SessionException ae) {
        request.setAttribute(getFailureKeyAttribute(), ae.getMessage());
    }

}
