package com.cmhb.module.oauth2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IndexAction {

	@RequestMapping(value = "noauth", method = RequestMethod.GET)
    public ModelAndView noauth() {
        return new ModelAndView("noauth");
	}

	@RequestMapping(value = "accessDenied", method = RequestMethod.GET)
    public ModelAndView accessDenied() {
        return new ModelAndView("accessDenied");
	}

    @RequestMapping(value = "info", method = RequestMethod.GET)
    public String info() {
        return "info";
    }

    @RequestMapping(value = "error", method = RequestMethod.GET)
    public String error() {
        return "error";
    }

    @RequestMapping(path = "test")
    @ResponseBody
    public String test() {
        return "test";
    }
}
