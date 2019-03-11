package com.cmhb.enums;

/**
 * Created by not3 on 17.4.13.
 */
public enum MethodTypeEnum {
	NEW("A", "新增"), UPDATE("U", "更新"),DELETE("D","删除");

	private MethodTypeEnum(String value, String desc) {
		this.value = value;
		this.desc = desc;
	}

	private String value;
	private String desc;

	public String value() {
		return value;
	}

	public String desc() {
		return desc;
	}
}
