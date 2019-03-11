package com.cmhb.module.oauth2;

import org.apache.oltu.oauth2.as.request.OAuthAuthzRequest;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;

import javax.servlet.http.HttpServletRequest;

/**
 * 15-6-17
 * <p/>
 * 扩展默认的 OAuthAuthzRequest ,  增加必要的方法
 *
 * @author Shengzhao Li
 */
public class OAuthAuthxRequest extends OAuthAuthzRequest {


    public OAuthAuthxRequest(HttpServletRequest request) throws OAuthSystemException, OAuthProblemException {
        super(request);
    }

    /*
    * 获取 request 对象
    * */
    public HttpServletRequest request() {
        return this.request;
    }
}
