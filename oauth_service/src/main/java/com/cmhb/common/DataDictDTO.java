package com.cmhb.common;

public interface DataDictDTO {
	public static final String SESSION_USERINFO = "cmhb_session_user";

	public static final String COOKIE_USERINFO = "cmhb_cookie_userinfo";

	public static final String RESOURCE_KEY = "cmhb_frame_resourceid";

	public static final String FORM_KEY = "cmhb_frame_form";

	public static final String BELONG_SYS = "belong_sys";

	public static final String SECURITY_CODE = "REMOTE_KAPTCHA_SESSION_KEY";

	/**
	 * COOKIE存放路径
	 */
	public static final String COOKIE_PATH = "/";

	/**
	 * COOKIE有效时间
	 */
	public static final int COOKIE_MAX_AGE = 20 * 60;// 有效时间20分钟

	/**
	 * COOKIE中用户信息分隔符
	 */
	public static final String COOKIE_USERINFO_SPLIT = "_";

	/**
	 * 运营后台静态资源路径-配置键
	 */
	public static final String CONF_KEY_STATIC_RESOURCE_PATH = "cmhb_boss_static_resources_path";

	/**
	 * 运营后台路径-配置键
	 */
	public static final String CONF_KEY_EMPLOYEE_BOSS_PATH = "employee_boss_base_uri";

	/**
	 * 操作员ID
	 */
	public static final String SESSION_USERID = "cmhb_session_userid";

	/**
	 * 双权限审核审核人ID
	 */
	public static final String SESSION_AUDIT_USERID = "cmhb_session_audit_userid";

	/**
	 * 双权限审核审核人信息
	 */
	public static final String SESSION_AUDIT_USERINFO = "cmhb_session_audit_user";
	
	/**
	 * 用户功能权限列表
	 */
	public static final String SESSION_USER_FUNCTION = "cmhb_session_user_function";
	
	/**
	 * 用户菜单缓存
	 */
	public static final String SESSION_USER_MENU = "menuTree";
	public static final String CALLBACK_REFUSE_NEEDED = "callback_refuse_needed";
	public static final String CALLBACK_CANCEL_NEEDED = "callback_cancel_needed";
}
