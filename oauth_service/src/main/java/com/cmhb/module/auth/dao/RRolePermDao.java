package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.RRoleMenu;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
public interface RRolePermDao extends BaseMapper<RRoleMenu> {
    void deleteClientPerms(@Param("roleId") Long roleId, @Param("clientId") Long clientId);
}