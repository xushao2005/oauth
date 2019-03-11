package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RDutyPermDao;
import com.cmhb.module.auth.domain.RDutyMenu;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
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
public class RDutyMenuService extends ServiceImpl<RDutyPermDao, RDutyMenu> {
    @Resource
    private RDutyPermDao rDutyPermDao;

    /**
     * 授予职责权限
     *
     * @param dutyId
     * @param clientId
     * @param permIds
     */
    public void grantDutyPerm(Long dutyId, Long clientId, List<Long> permIds) {
        if (dutyId == null || permIds == null || clientId == null) {
            return;
        }
        //去重复
        Set<Long> uniquePermIds = new HashSet<>(permIds);

        revokePerms(dutyId, clientId);

        List<RDutyMenu> rDutyMenus = new ArrayList<>();
        for (Long controlId : uniquePermIds) {
            RDutyMenu rDutyMenu = new RDutyMenu();
            rDutyMenu.setDutyId(dutyId);
            rDutyMenu.setControlId(controlId);
            rDutyMenu.setClientId(clientId);
            rDutyMenus.add(rDutyMenu);
        }
        if (!rDutyMenus.isEmpty()) {
            insertBatch(rDutyMenus);
        }
    }

    /**
     * 撤销指定岗位职责的所有权限
     *
     * @param dutyId
     */
    public void revokeAllPerms(Long dutyId) {
        Wrapper<RDutyMenu> wrapper = new EntityWrapper<>();
        wrapper.eq("duty_id", dutyId);
        delete(wrapper);
    }

    /**
     * 撤销岗位职责在指定应用下的权限
     *
     * @param dutyId
     * @param clientId
     */
    public void revokePerms(Long dutyId, Long clientId) {
        rDutyPermDao.deleteClientPerms(dutyId, clientId);
    }
}

