package com.cmhb.enums;

/**
 * Created by not3 on 17.4.13.
 */
public enum EntityTypeEnum {
	SUPPLIER("supplier", "供应商信息"),
	PRODUCT("product","产品信息"),
	SERVICE("service","服务信息"),
	EMPLOYEE("employee","员工信息"),
	REGION("region","国家信息"),
	BRANCH("bsWareHouse","分公司信息"),
	EXCHANGE("exchangeRate","汇率信息"),
	DOMESTIC_AREA("areaType","国内区域信息"),
	CHINA_POST_TYPE("cpType","中邮类型"),
	ELECTRIC_TYPE("electricType","带电类型"),
	PRODUCT_TYPE("productType","产品类型");

    EntityTypeEnum(String value, String desc) {
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
