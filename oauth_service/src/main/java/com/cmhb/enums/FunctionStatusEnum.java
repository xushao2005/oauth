/**    
 * 
 * Copyright: Copyright (c)2011
 * Company: 易宝支付(YeePay) 
 *    
 */
package com.cmhb.enums;

import java.util.HashMap;
import java.util.Map;


public enum FunctionStatusEnum {

	ACTIVE, // 活动
	FROZEN, // 冻结
	FORBIDDEN;// 停用
	
	public static Map<String, String> toMap(){
		Map<String, String> toReturnMap=new HashMap<String, String>();
		toReturnMap.put(ACTIVE.name(), "正常");
		toReturnMap.put(FROZEN.name(), "已冻结");
		toReturnMap.put(FORBIDDEN.name(), "已停用");
		return toReturnMap;
	}

}
