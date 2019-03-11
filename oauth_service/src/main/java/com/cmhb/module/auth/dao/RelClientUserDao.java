package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.RelClientUser;

import java.util.List;

/**
 * <p>
  * ${table.comment} Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
public interface RelClientUserDao extends BaseMapper<RelClientUser> {
    List<Long> selectByUserId(Long userId);

    List<Long> selectByClientId(Long clientId);

}