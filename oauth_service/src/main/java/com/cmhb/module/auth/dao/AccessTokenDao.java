package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.AccessToken;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
  * ${table.comment} Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
public interface AccessTokenDao extends BaseMapper<AccessToken> {
    List<AccessToken> findByUser(@Param("userId") Long userId, @Param("secretKey") String secretKey);

    AccessToken findByToken(String accessToken);

    AccessToken findByRefreshToken(String refreshToken);
}