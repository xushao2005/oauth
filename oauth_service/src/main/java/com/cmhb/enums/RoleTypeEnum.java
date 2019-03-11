/**    
 * 
 * Copyright: Copyright (c)2011
 * Company: 易宝支付(YeePay) 
 *    
 */
package com.cmhb.enums;

import java.util.HashMap;
import java.util.Map;


public enum RoleTypeEnum {
	
	BASIC,
	STAFF,
	TEMP,
	CROSS,
	SYSADMIN,
	DEPTADMIN,
	DEPT_PUBLIC;
	public static Map<String, String> toMap(){
		Map<String, String> toReturnMap=new HashMap<String, String>();
		toReturnMap.put(BASIC.name(), "基本的");
		toReturnMap.put(STAFF.name(), "雇员的");
		toReturnMap.put(TEMP.name(), "临时的");
		toReturnMap.put(CROSS.name(), "跨部门的");
		toReturnMap.put(SYSADMIN.name(), "系统管理员的");
		toReturnMap.put(DEPTADMIN.name(), "部门管理员的");
		toReturnMap.put(DEPT_PUBLIC.name(), "部门公有的");
		return toReturnMap;
	}
}
