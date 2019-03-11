package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.RUserRole;
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
public interface RUserRoleDao extends BaseMapper<RUserRole> {
    List<Long> selectRoleIds(@Param("userId") Long userId);

}