package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.pagination.Pagination;
import com.cmhb.module.auth.domain.Role;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
public interface RoleDao extends BaseMapper<Role> {
    List<Role> selectRoleByUserId(Long userId);

    List<Role> selectPage(Map<String, Object> params, Pagination page);
}