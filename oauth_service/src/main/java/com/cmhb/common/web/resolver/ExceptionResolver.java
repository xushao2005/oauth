package com.cmhb.common.web.resolver;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 处理未捕捉异常
 *
 * @author liuwd
 */
@Deprecated
public class ExceptionResolver implements HandlerExceptionResolver {
    private static final Log logger = LogFactory.getLog(ExceptionResolver.class);

    private String errorPage = "/error";

    private String deniedPage = "/accessDenied.htm";

    public void setErrorPage(String errorPage) {
        this.errorPage = errorPage;
    }


    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response, Object handler, Exception ex) {
        logger.error("web error", ex);
        return new ModelAndView(this.errorPage);
    }


    private ModelAndView resolveAccessDeniedException(HttpServletRequest request) {
        return new ModelAndView("redirect:" + this.deniedPage);
    }

    public String getDeniedPage() {
        return deniedPage;
    }

    public void setDeniedPage(String deniedPage) {
        this.deniedPage = deniedPage;
    }

    public String getErrorPage() {
        return errorPage;
    }

}
