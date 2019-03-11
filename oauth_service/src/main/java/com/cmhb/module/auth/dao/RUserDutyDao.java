package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.RUserDuty;
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
public interface RUserDutyDao extends BaseMapper<RUserDuty> {
    List<Long> selectDutyIds(@Param("userId") Long userId);
}