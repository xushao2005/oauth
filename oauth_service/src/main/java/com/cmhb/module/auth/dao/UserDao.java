package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.pagination.Pagination;
import com.cmhb.module.auth.domain.User;

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
public interface UserDao extends BaseMapper<User> {

    List<User> selectPage(Map<String, Object> params, Pagination page);

    Integer changePasswd(User user);

    Integer changeAuthInfo(User user);

    void logoffPosition(Map<String, Object> params);

    List<User> selectWithLikeNoOrName(Pagination page, Map<String, Object> params);

    void doUpdateUser(User user);
}