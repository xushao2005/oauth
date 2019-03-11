package com.cmhb.module.auth.controller;

import com.cmhb.common.annotation.CurrentUser;
import com.cmhb.common.shiro.ShiroUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by luxp on 2017/8/11.
 */
@RestController
@RequestMapping("/authc")
public class AuthController {
    /**
     * @param shiroUser
     *
     * @return
     */
    @GetMapping("/user")
    public ShiroUser currentUser(@CurrentUser ShiroUser shiroUser) {
        return shiroUser;
    }
}
