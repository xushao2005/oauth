package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RUserRoleDao;
import com.cmhb.module.auth.domain.RUserRole;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
@Service
public class RUserRoleService extends ServiceImpl<RUserRoleDao, RUserRole> {
    @Resource
    private RUserRoleDao rUserRoleDao;

    /**
     * 授予一个角色给多个用户
     *
     * @param userIds
     * @param roleId
     */
    public void grantUsersRole(List<Long> userIds, Long roleId) {
        grantUsersRoles(userIds, Collections.singletonList(roleId));
    }


    /**
     * 授予多个角色给一个用户
     *
     * @param userId
     * @param roleIds
     */
    public void grantUserRoles(Long userId, List<Long> roleIds) {
        grantUsersRoles(Collections.singletonList(userId), roleIds);
    }

    /**
     * 授予用户权限
     *
     * @param userIds
     * @param roleIds
     */
    public void grantUsersRoles(List<Long> userIds, List<Long> roleIds) {
        if (userIds == null || roleIds == null) {
            return;
        }
        //去除重复id
        Set<Long> uniqueUserIds = new HashSet<>(userIds);
        Set<Long> uniqueRoleIds = new HashSet<>(roleIds);
        if (uniqueUserIds.isEmpty() || uniqueRoleIds.isEmpty()) {
            return;
        }

        List<RUserRole> rUserRoles = new ArrayList<>();
        for (Long roleId : uniqueRoleIds) {
            for (Long userId : uniqueUserIds) {
                RUserRole rUserRole = new RUserRole();
                rUserRole.setRoleId(roleId);
                rUserRole.setUserId(userId);
                rUserRoles.add(rUserRole);
            }
        }
        insertBatch(rUserRoles);
    }

    /**
     * 撤销用户权限
     *
     * @param userId
     */
    public void revokeAllRoles(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is null");
        }
        Wrapper<RUserRole> wrapper = new EntityWrapper<>();
        wrapper.eq("user_id", userId);
        delete(wrapper);
    }

    public List<Long> findRoleIdByUser(Long userId) {
        return rUserRoleDao.selectRoleIds(userId);
    }
}
