package com.cmhb.enums;

/**
 * 系统菜单，用于系统权限控制
 * @author 于骁丹
 * @version V1.0
 * @see [相关类/方法]
 * @since 2015年12月24日 下午4:37:56
 */
public enum SysMenuEnums {


	/*MANAGE_USER("0101"),//用户管理*/
	MANAGE_USER("11"),//用户管理
	MANAGE_ROLE("0102"),//角色管理
	MANAGE_MENU("0103"),//菜单管理
	
	MANAGE_DECLARE_MENU("02"),//申报菜单管理
	
	DECLARE_LIST("0201"),//查询权限
	DECLARE_IMPORTEXCEL("0202"),//导入excel权限
	DECLARE_EXPORTEXCEL("0203"),//导出excel权限
	DECLARE_EDIT("0204"),//编辑页面权限
	DECLARE_VIEW("0205"),//查看权限页面
	DECLARE_VIEWERROR("0206"),//查看错误信息权限
	DECLARE_VIEWTRACE("0207"),//查看错误轨迹权限
	DECLARE_VIEWRECEIPT("0208"),//查看回执权限
	DECLARE_VIEWDECLARE("0209"),//查看申报权限
	DECLARE_DOEDIT("0210"),//编辑权限
	DECLARE_DOEDITFORCE("0211"),//强制提交权限
	DECLARE_DECLARE("0212")//申报权限
	;
	
	private String menuId;
	
	private SysMenuEnums(String menuId){
		this.menuId = menuId;
	}

	public String getMenuId() {
		return menuId;
	}

	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	


}
