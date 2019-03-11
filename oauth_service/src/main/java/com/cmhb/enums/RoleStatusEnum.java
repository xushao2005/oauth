/**    
 * 
 * Copyright: Copyright (c)2011
 * Company: 易宝支付(YeePay) 
 *    
 */
package com.cmhb.enums;

import java.util.Map;
import java.util.TreeMap;


public enum RoleStatusEnum {
	
	ACTIVE("正常"),//活动的
	
	FROZEN("已冻结"),//冻结的
	
	FORBID("废弃的");//废弃的

	private String name;

	RoleStatusEnum(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public static Map<String, String> toMap(){
        Map<String, String> toReturnMap = new TreeMap<String, String>();

		toReturnMap.put(ACTIVE.name(), "正常");
		toReturnMap.put(FROZEN.name(), "已冻结");
		toReturnMap.put(FORBID.name(), "废弃的");
		return toReturnMap;
	}
}
