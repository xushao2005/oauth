package com.cmhb.module.oauth2;

import com.cmhb.common.utils.JsonUtils;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.oauth2.model.Result;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by luxp on 2017/8/29.
 */
@Service
@Slf4j
public class OAuth2Service {
    public Result login(HttpServletRequest request) {
        Result result = new Result();
        //submit login
        if (!submitLogin(request)) {
            result.setSuccessful(false);
            result.setMsg("登录失败");
            return result;
        }
        result.setSuccessful(true);
        return result;
    }


    //true is login failed, false is successful
    protected boolean submitLogin(HttpServletRequest request) {
        if (isSubmitLogin(request)) {
            //login flow
            try {
                UsernamePasswordToken token = createUsernamePasswordToken(request);
                SecurityUtils.getSubject().login(token);

                log.debug("Submit login successful");
                return true;
            } catch (Exception ex) {
                //login failed
                log.debug("Login failed, back to login page too", ex);
                return false;
            }
        }
        return false;
    }

    private UsernamePasswordToken createUsernamePasswordToken(HttpServletRequest request) throws IOException {
        int len = request.getContentLength();
        ServletInputStream in = request.getInputStream();
        byte[] buffer = new byte[len];
        in.read(buffer, 0, len);
        val requestBody = new String(buffer);
        val user = JsonUtils.parse(requestBody, User.class);
        String username = user.getLoginName();
        String password = user.getPassword();
        return new UsernamePasswordToken(username, password);
    }

    private boolean isSubmitLogin(HttpServletRequest request) {
        return !isUserAuthenticated() && isPost(request);
    }

    protected boolean isPost(HttpServletRequest request) {
        return RequestMethod.POST.name().equalsIgnoreCase(request.getMethod());
    }

    protected boolean isUserAuthenticated() {
        final Subject subject = SecurityUtils.getSubject();
        return subject.isAuthenticated();
    }

}
