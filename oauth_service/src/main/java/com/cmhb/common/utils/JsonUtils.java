package com.cmhb.common.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

/**
 * Created by L.cm
 * Date: 2015-25-12 17:57
 */
public final class JsonUtils {
	private JsonUtils() {
	}

	/**
	 * 将对象序列化成json字符串
	 *
	 * @param object javaBean
	 * @return jsonString json字符串
	 */
	public static String toJson(Object object) {
		try {
			return getInstance().writeValueAsString(object);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * @param object javaBean
	 * @return jsonBytes
	 */
	public static byte[] toJsonBytes(Object object) {
		try {
			return getInstance().writeValueAsBytes(object);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 将json反序列化成对象
	 *
	 * @param jsonString jsonString
	 * @param valueType  class
	 * @param <T>        T 泛型标记
	 * @return Bean
	 */
	public static <T> T parse(String jsonString, Class<T> valueType) {
		try {
			return getInstance().readValue(jsonString, valueType);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static <T> List<T> parseList(String jsonString, Class<T> valueType) {
		try {
			return getInstance().readValue(jsonString,
					getCollectionType(List.class, valueType));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 获取泛型的Collection Type
	 */
	public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {
		return getInstance().getTypeFactory()
				.constructParametricType(collectionClass, elementClasses);
	}

	private static ObjectMapper getInstance() {
		return JacksonHolder.INSTANCE;
	}

	private static class JacksonHolder {
		private static ObjectMapper INSTANCE = new JacksonObjectMapper();
	}

}
