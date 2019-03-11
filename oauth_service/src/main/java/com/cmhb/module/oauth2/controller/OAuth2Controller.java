package com.cmhb.module.oauth2.controller;

import com.cmhb.module.oauth2.OAuth2Service;
import com.cmhb.module.oauth2.OAuthAuthxRequest;
import com.cmhb.module.oauth2.authorize.CodeAuthorizeHandler;
import com.cmhb.module.oauth2.model.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by luxp on 2017/8/29.
 */
@Controller
@RequestMapping("/oauth")
@Slf4j
public class OAuth2Controller {
    @Resource
    private OAuth2Service oAuth2Service;
    @Value("${oauth2.frontUri}")
    private String frontUri;
    @Value("${oauth2.logoutUri}")
    private String logoutUri;

    @RequestMapping("/local/authorize")
    @ResponseBody
    public ResponseEntity authorize(HttpServletRequest request, HttpServletResponse response) {
        Result result = new Result();
        try {
            OAuthAuthxRequest oauthRequest = new OAuthAuthxRequest(request);
            CodeAuthorizeHandler codeAuthorizeHandler = new CodeAuthorizeHandler(oauthRequest, response);
            result = codeAuthorizeHandler.handle();
        } catch (Exception e) {
            log.error(e.getMessage());
            result.setSuccessful(false);
            result.setMsg(e.getMessage());
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity oauthLogin(HttpServletRequest request, HttpServletResponse response) {
        Result result = new Result();
        try {
            result = oAuth2Service.login(request);
        } catch (Exception e) {
            log.error(e.getMessage());
            result.setSuccessful(false);
            result.setMsg(e.getMessage());
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping("/authorize")
    public String authorize(@RequestParam(value = "client_id", required = false) String clientId,
                            @RequestParam(value = "redirect_uri", required = false) String redirectUri,
                            @RequestParam(value = "response_type", required = false) String responseType) {
        String authorizeUrlPattern = "%s/#/oauth2/authorize?client_id=%s&response_type=%s&redirect_uri=%s";
        String authorizeUrl = String.format(authorizeUrlPattern, frontUri, clientId, responseType, redirectUri);
        return "redirect:" + authorizeUrl;
    }

    /**
     * 重定向到首页
     *
     * @return
     */
    @RequestMapping("/index")
    public String index() {
        return "redirect:" + frontUri;
    }

    /**
     * 重定向到首页
     *
     * @return
     */
    @RequestMapping("/logoutPage")
    public String logoutPage() {
        return "redirect:" + logoutUri;
    }
}
