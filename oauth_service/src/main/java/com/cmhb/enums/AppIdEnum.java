package com.cmhb.enums;

import java.util.HashMap;
import java.util.Map;

public enum AppIdEnum {

	
	YW("34ed5259-9f3e-4fdc-b971-debe4bdbf8c7feff8","燕文"),HY("35ba8f07-cc10-4257-add6-a6ee059d5ec8d4d23","宏远");
	private String appId;
	private String appName;
	private AppIdEnum(String appId,String appName){
		this.appId=appId;
		this.appName=appName;
		
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public static Map<String, String> toMap(){
		Map<String,String> toreturn=new HashMap<String, String>();
		for(AppIdEnum enum1:AppIdEnum.values()){
			toreturn.put(enum1.getAppId(), enum1.getAppName());
		}
		return toreturn;
	}
	
}
