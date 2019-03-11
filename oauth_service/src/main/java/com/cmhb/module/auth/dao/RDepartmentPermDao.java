package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.RDepartmentMenu;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
public interface RDepartmentPermDao extends BaseMapper<RDepartmentMenu> {
    void deleteClientPerms(@Param("departmentId") Long departmentId, @Param("clientId") Long clientId);
}