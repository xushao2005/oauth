package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.Control;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
public interface MenuDao extends BaseMapper<Control> {
	List<Control> selectPermByRoleId(@Param("roleId") Long roleId);

	/**
	 * 查询角色权限
	 *
	 * @param roleId       角色id
	 * @param resourceType api（0）、菜单（1）、视图（2）、按钮（3）
	 * @return
	 */
	List<Control> selectPermByRoleId(@Param("roleId") Long roleId, @Param("type") String resourceType);

	List<Control> selectByRoleAndClient(@Param("roleId") Long roleId, @Param("clientId") Long clientId);

	List<Control> selectByRoleClientType(@Param("roleId") Long roleId, @Param("clientId") Long clientId, @Param("type") String resourceType);

	List<Control> selectByDepartmentAndClient(@Param("departmentId") Long departmentId, @Param("clientId") Long clientId);

	List<Control> selectByDepartmentClientType(@Param("departmentId") Long departmentId, @Param("clientId") Long clientId, @Param("type") String resourceType);

	List<Control> selectByDutyAndClient(@Param("dutyId") Long dutyId, @Param("clientId") Long clientId);

	List<Control> selectByDutyClientType(@Param("dutyId") Long dutyId, @Param("clientId") Long clientId, @Param("type") String resourceType);

	Integer updateByPrimaryKeySelective(Control control);
}