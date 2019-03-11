package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.RDutyMenu;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
public interface RDutyPermDao extends BaseMapper<RDutyMenu> {
    void deleteClientPerms(@Param("dutyId") Long dutyId, @Param("clientId") Long clientId);
}