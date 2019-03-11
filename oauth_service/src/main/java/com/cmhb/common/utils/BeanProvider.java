package com.cmhb.common.utils;

import org.springframework.context.ApplicationContext;

import java.util.Locale;

public abstract class BeanProvider {

    private static ApplicationContext applicationContext;

    public static void initialize(ApplicationContext applicationContext) {
        BeanProvider.applicationContext = applicationContext;
    }

    public static Object getBean(String beanName) {
        return applicationContext.getBean(beanName);
    }

    public static  <T> T getBean(Class<T> cls) {
        return applicationContext.getBean(cls);
    }

    public static  <T> T getBean(String beanName, Class<T> cls) {
        return applicationContext.getBean(beanName, cls);
    }

    public static String getMessage(String key) {
        return applicationContext.getMessage(key, null, Locale.getDefault());
    }
}
