package com.cmhb.common.shiro.filter.authc;

import lombok.val;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by luxp on 2017/6/13.
 */
public class UserFilter extends org.apache.shiro.web.filter.authc.UserFilter {
    private static final Logger log = LoggerFactory.getLogger(UserFilter.class);

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        val httpResponse = (HttpServletResponse) response;
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }

    @Override
    protected void cleanup(ServletRequest request, ServletResponse response, Exception existing) throws ServletException, IOException {
        if (existing != null) {
            log.warn("{}", existing);
            try {
                afterCompletion(request, response, existing);
            } catch (Exception e) {
                log.debug("afterCompletion implementation threw an exception.  This will be ignored to " +
                        "allow the original source exception to be propagated.", e);
            }
            return;
        }

        super.cleanup(request, response, null);
    }
}
