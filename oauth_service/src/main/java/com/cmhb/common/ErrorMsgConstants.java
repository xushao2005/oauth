package com.cmhb.common;

/**
 * 异常原因描述
 * @author 于骁丹
 * @version V1.0
 * @see [相关类/方法]
 * @since 2015年12月21日 上午9:53:50
 */
public class ErrorMsgConstants {

	static public final String ERRMSG = "errorMessage";
	
	static public final String ERR_NO_USER = "没有此用户";
	
	static public final String ERR_WRONG_PASSWORD = "密码错误";
	
	static public final String ERR_WRONG_OLD_PASSWORD = "原密码错误";
	
	static public final String ERR_ROLE_NAME_EXIST = "角色名称已经存在";
	
	static public final String ERR_ROLE_HAS_USER = "角色被用户占用，请先删除此角色的用户";
	
	static public final String ERR_USER_HAS_SUB_USER = "请先删除此用户创建的子用户";
	
	static public final String ERR_DATA_VALIDATE_FALSE = "请不要删除别人的东西";
	
	static public final String ERR_LOGIN_NAME_EXIST = "登录名已经被占用";
	
	static public final String ERR_PASSWORD_VALIDATE = "两次输入的密码不一样";
	
	static public final String SUC_PASSWORD_EDIT = "密码修改成功";
	
	static public final String ERR_M_CATEGORY_EXIST = "大类已被小类占用，请先删除此大类下的小类";
	
	static public final String ERR_M_CATEGORY_DEL = "大类已被商品占用，请先删除大类下的商品";

	static public final String ERR_S_CATEGORY_EXIST = "小类已被商品占用，请先删除小类下的商品";
	
	static public final String ERR_M_CATEGORY_EDIT = "大类下的小类不能为空，请先选择小类";
	static public final String ERR_CHANGEPWD_VALIDATE="修改密码校验出错";
	static public final String SUC_CHANGEPWD="修改密码成功，请重新登录";
}
