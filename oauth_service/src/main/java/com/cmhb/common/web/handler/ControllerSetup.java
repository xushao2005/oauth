package com.cmhb.common.web.handler;

import com.cmhb.common.exceptions.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Created by not3 on 17.6.8.
 */
@RestControllerAdvice
@Slf4j
public class ControllerSetup {
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(false);
        binder.registerCustomEditor(String.class, stringTrimmerEditor);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorVo exception(Exception e) {
        log.error("{}, {}", e.getMessage(), e);
        e.printStackTrace();
        return new ErrorVo(999, e.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.OK)
    public ErrorVo exception(ValidationException e) {
        log.error("{}, {}", e.getMessage(), e);
        return new ErrorVo(4100, e.getMessage());
    }
}