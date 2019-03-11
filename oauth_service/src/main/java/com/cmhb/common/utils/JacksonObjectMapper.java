package com.cmhb.common.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JacksonObjectMapper extends ObjectMapper {
	private static final long serialVersionUID = 1L;

	public JacksonObjectMapper() {
        this.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        this.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        SimpleModule deserializeModule = new SimpleModule("DeserializeModule");
//        deserializeModule.addDeserializer(Permission.class, new PermDeserializer());
//        this.registerModule(deserializeModule);
    }

}
