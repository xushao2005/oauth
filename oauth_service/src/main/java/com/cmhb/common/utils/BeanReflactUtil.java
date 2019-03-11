package com.cmhb.common.utils;

import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class BeanReflactUtil {
	
	
	public static String fieldsToString(Object object){
		StringBuffer stringBuffer = new StringBuffer();
		stringBuffer.append(Thread.currentThread().getStackTrace()[2]);
		if (object == null) {
            return stringBuffer.append("null").toString();
        }
		Field[] fields = object.getClass().getDeclaredFields();
		stringBuffer.append("\r\n")
					.append(object.getClass().getName())
					.append("{\r\n\t");
		for (Field field : fields) {
			try {
				field.setAccessible(true);
				stringBuffer.append(field.getName())
							.append(":")
							.append(field.get(object))
							.append("    ");
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		stringBuffer.append("\r\n}");
		return stringBuffer.toString();
	}


	/**
	 * bean字段为key,值为value
	 * 用于查询
	 * @param object
	 * @return
	 */
	public static Map<String, Object> fieldsToMap(Object object) {
		Map<String, Object> params = new HashMap<>();
		if (object == null) {
			return params;
		}
		Field[] fields = object.getClass().getDeclaredFields();
		if (fields == null || fields.length == 0) {
			return params;
		}
		Object value;
		for (Field field : fields) {
			try {
				field.setAccessible(true);
				value = field.get(object);
				//TODO 基本类型默认值 待验证
				if (value == null) {
					continue;
				}
				if (String.class.isInstance(value) && StringUtils.isBlank(value.toString())) {
					continue;
				}
				params.put(field.getName(), value);
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return params;
	}
	

}
