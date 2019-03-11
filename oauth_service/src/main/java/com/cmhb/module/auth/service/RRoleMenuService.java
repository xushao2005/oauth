package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RRolePermDao;
import com.cmhb.module.auth.domain.RRoleMenu;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class RRoleMenuService extends ServiceImpl<RRolePermDao, RRoleMenu> {
    @Resource
    private RRolePermDao rRolePermDao;

    /**
     * 授予用户权限
     *
     * @param permIds
     * @param clientId
     * @param roleIds
     */
    public void grantRolePerm(List<Long> permIds, Long clientId, Long roleIds) {
        grantRolePerm(Collections.singletonList(roleIds), clientId, permIds);
    }

    /**
     * 授予多个角色权限
     *
     * @param roleIds
     * @param clientId
     * @param permIds
     */
    public void grantRolePerm(List<Long> roleIds, Long clientId, List<Long> permIds) {
        if (roleIds == null || permIds == null || clientId == null) {
            return;
        }
        //去重复
        Set<Long> uniqueRoleIds = new HashSet<>(roleIds);
        Set<Long> uniquePermIds = new HashSet<>(permIds);
        //角色不存在
        if (uniqueRoleIds.isEmpty()) {
            log.warn("角色不存在。角色:{}", uniqueRoleIds);
            return;
        }

        List<RRoleMenu> rRoleMenus = new ArrayList<>();
        for (Long roleId : uniqueRoleIds) {
            revokePerms(roleId, clientId);
            for (Long controlId : uniquePermIds) {
                RRoleMenu rRoleMenu = new RRoleMenu();
                rRoleMenu.setRoleId(roleId);
                rRoleMenu.setControlId(controlId);
                rRoleMenu.setClientId(clientId);
                rRoleMenus.add(rRoleMenu);
            }
        }
        if (!rRoleMenus.isEmpty()) {
            insertBatch(rRoleMenus);
        }
    }

    /**
     * 撤销角色所有权限
     *
     * @param roleId
     */
    public void revokeAllPerms(Long roleId) {
        Wrapper<RRoleMenu> wrapper = new EntityWrapper<>();
        wrapper.eq("role_id", roleId);
        delete(wrapper);
    }

    /**
     * 撤销角色在指定应用下的权限
     *
     * @param roleId
     * @param clientId
     */
    public void revokePerms(Long roleId, Long clientId) {
        rRolePermDao.deleteClientPerms(roleId, clientId);
    }
}

