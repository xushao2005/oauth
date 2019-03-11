package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RPositionDutyDao;
import com.cmhb.module.auth.domain.RPositionDuty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

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
public class RPositionDutyService extends ServiceImpl<RPositionDutyDao, RPositionDuty> {
    @Resource
    private RPositionDutyDao rPositionDutyDao;

    /**
     * 岗位添加岗位职责
     *
     * @param positionId
     * @param dutyId
     */
    public void grantPositionDuty(Long positionId, Long dutyId) {
        if (positionId == null || dutyId == null) {
            return;
        }

        RPositionDuty rPositionDuty = new RPositionDuty();
        rPositionDuty.setPositionId(positionId);
        rPositionDuty.setDutyId(dutyId);
        rPositionDutyDao.insert(rPositionDuty);
    }

    /**
     * 岗位删除岗位职责
     *
     * @param dutyId
     */
    public void revokePositionDuty(Long dutyId) {
        if (dutyId == null) {
            return;
        }

        RPositionDuty rPositionDuty = new RPositionDuty();
        rPositionDuty.setDutyId(dutyId);
        rPositionDutyDao.delete(new EntityWrapper<RPositionDuty>(rPositionDuty));
    }
}

