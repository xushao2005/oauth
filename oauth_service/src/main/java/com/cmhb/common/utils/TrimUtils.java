package com.cmhb.common.utils;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class TrimUtils {

	public static void main(String[] args) {
		
	}
	public static Object trimObj(Object object){
		if(null==object){
			return object;
		}
		Method[] methods=object.getClass().getDeclaredMethods();
		for(int i=0;i<methods.length;i++){
			Method method=methods[i];
			String methodName=method.getName();
			if(methodName.startsWith("get")){
				if("java.lang.String".equals(method.getReturnType().getName())){
					try {
						String value = (String) method.invoke(object);
						if(StringUtils.isNotBlank(value)){
							value=value.trim();
							String setMethodName="set"+methodName.substring(3,methodName.length());
							
							try {
								Method setMethod=object.getClass().getMethod(setMethodName, String.class);
								setMethod.invoke(object, value);
							}
							catch (NoSuchMethodException e) {
								return object;
							}
							catch (SecurityException e) {
								return object;
							}
							
						}
					}
					catch (IllegalAccessException e) {
						return object;
					}
					catch (IllegalArgumentException e) {
						return object;
					}
					catch (InvocationTargetException e) {
						return object;
					}
				}else{
					//TODO 包含的类也做递归trim
				}
			}
		}
		return object;
	}
}
