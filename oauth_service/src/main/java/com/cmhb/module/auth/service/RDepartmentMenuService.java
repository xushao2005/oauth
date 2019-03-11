package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RDepartmentPermDao;
import com.cmhb.module.auth.domain.RDepartmentMenu;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
public class RDepartmentMenuService extends ServiceImpl<RDepartmentPermDao, RDepartmentMenu> {
    @Resource
    private RDepartmentPermDao rDepartmentPermDao;

    /**
     * 授予用户权限
     *
     * @param permIds
     * @param clientId
     * @param departmentIds
     */
    public void grantDepartmentPerm(List<Long> permIds, Long clientId, Long departmentIds) {
        grantDepartmentPerm(Collections.singletonList(departmentIds), clientId, permIds);
    }

    /**
     * 授予多个部门权限
     *
     * @param departmentIds
     * @param clientId
     * @param permIds
     */
    public void grantDepartmentPerm(List<Long> departmentIds, Long clientId, List<Long> permIds) {
        if (departmentIds == null || permIds == null || clientId == null) {
            return;
        }
        //去重复
        Set<Long> uniqueDepartmentIds = new HashSet<>(departmentIds);
        Set<Long> uniquePermIds = new HashSet<>(permIds);
        //部门不存在
        if (uniqueDepartmentIds.isEmpty()) {
            log.warn("部门不存在。部门:{}", uniqueDepartmentIds);
            return;
        }

        List<RDepartmentMenu> rDepartmentMenus = new ArrayList<>();
        for (Long departmentId : uniqueDepartmentIds) {
            revokePerms(departmentId, clientId);
            for (Long controlId : uniquePermIds) {
                RDepartmentMenu rDepartmentMenu = new RDepartmentMenu();
                rDepartmentMenu.setDepartmentId(departmentId);
                rDepartmentMenu.setControlId(controlId);
                rDepartmentMenu.setClientId(clientId);
                rDepartmentMenus.add(rDepartmentMenu);
            }
        }
        if (!rDepartmentMenus.isEmpty()) {
            insertBatch(rDepartmentMenus);
        }
    }

    /**
     * 撤销部门所有权限
     *
     * @param departmentId
     */
    public void revokeAllPerms(Long departmentId) {
        Wrapper<RDepartmentMenu> wrapper = new EntityWrapper<>();
        wrapper.eq("department_id", departmentId);
        delete(wrapper);
    }

    /**
     * 撤销部门在指定应用下的权限
     *
     * @param departmentId
     * @param clientId
     */
    public void revokePerms(Long departmentId, Long clientId) {
        rDepartmentPermDao.deleteClientPerms(departmentId, clientId);
    }
}

