package com.cmhb.common.utils;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import java.util.Locale;

public class SpringContextUtil implements ApplicationContextAware
{

	private static SpringContextUtil instance = new SpringContextUtil();

	private ApplicationContext context;

	private SpringContextUtil()
	{

	}

	public static SpringContextUtil getInstance()
	{
		return instance;
	}

	@Override
	public void setApplicationContext(ApplicationContext contex)
			throws BeansException
	{
		this.context = contex;

	}

	public Object getBean(String beanName)
	{
		return context.getBean(beanName);
	}

	public <T> T getBean(Class<T> cls)
	{
		return context.getBean(cls);
	}

	public <T> T getBean(String beanName, Class<T> cls)
	{
		return context.getBean(beanName, cls);
	}

	public String getMessage(String key)
	{
		return context.getMessage(key, null, Locale.getDefault());
	}
}
