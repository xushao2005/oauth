/**
 *
 * Copyright: Copyright (c)2011
 * Company: 易宝支付(YeePay)
 *
 */
package com.cmhb.enums;

import java.util.HashMap;
import java.util.Map;


public enum FunctionTypeEnum {
	

	/**
	 * 部门公开
	 */
	DEPARTMENT_PUBLIC,

	/**
	 * 部门私有
	 */
	DEPARTMENT_PRIVATE,

	/**
	 * 用户公开
	 */
	USER_PUBLIC,

	/**
	 * 系管员私有
	 */
	SYSADMIN_PRIVATE;
	
	public static Map<String, String> toMap(){
		Map<String, String> toReturnMap=new HashMap<String, String>();
		toReturnMap.put(DEPARTMENT_PUBLIC.name(), "部门公开");
		toReturnMap.put(DEPARTMENT_PRIVATE.name(), "部门私有");
		toReturnMap.put(USER_PUBLIC.name(), "用户公开");
		toReturnMap.put(SYSADMIN_PRIVATE.name(), "系统管理员私有");
		return toReturnMap;
	}
}
