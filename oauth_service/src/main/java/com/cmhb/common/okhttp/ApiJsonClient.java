package com.cmhb.common.okhttp;

import com.alibaba.fastjson.JSON;
import lombok.Data;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

import java.util.concurrent.TimeUnit;

/**
 * Created by not3 on 17.6.1.
 */
@Data
@Slf4j
public class ApiJsonClient<T, S> {
	private static final MediaType MEDIA_TYPE_JSON = MediaType.parse("application/json; charset=utf-8");
	private static OkHttpClient client = null;
	private int readTimeout = 10;
	private int writeTimeout = 10;
	private int connectTimeout = 10;
	private String url;

	@SneakyThrows
	public S call(@NonNull T body, Class<S> clazz) {
		return call(body, clazz, this.url);
	}

	@SneakyThrows
	public S call(@NonNull T body, Class<S> clazz, String callUrl) {
		val postBody = JSON.toJSONString(body);
		Request request = new Request.Builder()
				.url(callUrl)
				.post(RequestBody.create(MEDIA_TYPE_JSON, postBody))
				.build();
		log.debug("postBody: {}", postBody);
		log.debug("connectTimeoutMillis: {}", client.connectTimeoutMillis());
		log.debug("readTimeoutMillis: {}", client.readTimeoutMillis());
		log.debug("writeTimeoutMillis: {}", client.writeTimeoutMillis());
		val response = client.newCall(request).execute();
		return JSON.parseObject(response.body().bytes(), clazz);
	}

	private void init() {
		client = new OkHttpClient.Builder()
				.readTimeout(readTimeout, TimeUnit.SECONDS)
				.writeTimeout(writeTimeout, TimeUnit.SECONDS)
				.connectTimeout(connectTimeout, TimeUnit.SECONDS)
				.build();
	}
}
