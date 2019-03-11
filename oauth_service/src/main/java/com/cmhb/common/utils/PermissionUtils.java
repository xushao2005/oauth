/**
 * Copyright: Copyright (c)2011
 * Company: 易宝支付(YeePay)
 */
package com.cmhb.common.utils;

import com.cmhb.common.shiro.ShiroUser;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;


public class PermissionUtils {
	/**
	 * 取得当前用户
	 * 
	 * @return
	 */
    public String getCurrentUser() {
        Subject subject = SecurityUtils.getSubject();
        ShiroUser currentUser = (ShiroUser) subject.getPrincipal();
        if (currentUser == null) {
            return "";
        }
        return currentUser.getName();
    }

	/**
	 * 判断是否有权限访问某个功能
	 * 
	 * @param function
	 *            功能对应的URI
	 * @return
	 */
	public boolean hasPermit(String function) {
        Subject subject = SecurityUtils.getSubject();
        return subject.isPermitted(function);
    }
}
