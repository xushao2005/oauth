package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RUserDutyDao;
import com.cmhb.module.auth.domain.RUserDuty;
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
public class RUserDutyService extends ServiceImpl<RUserDutyDao, RUserDuty> {
    @Resource
    private RUserDutyDao rUserDutyDao;


    /**
     * 授予一个用户多个岗位职责
     *
     * @param userId
     * @param dutyIds
     */
    public void grantUserDuties(Long userId, List<Long> dutyIds) {
        grantUsersDuties(Collections.singletonList(userId), dutyIds);
    }

    /**
     * 授予用户职责
     *
     * @param userIds
     * @param dutyIds
     */
    public void grantUsersDuties(List<Long> userIds, List<Long> dutyIds) {
        if (userIds == null || dutyIds == null) {
            return;
        }
        //去除重复id
        Set<Long> uniqueUserIds = new HashSet<>(userIds);
        Set<Long> uniqueDutyIds = new HashSet<>(dutyIds);
        if (uniqueUserIds.isEmpty() || uniqueDutyIds.isEmpty()) {
            return;
        }

        List<RUserDuty> rUserDuties = new ArrayList<>();
        for (Long dutyId : uniqueDutyIds) {
            for (Long userId : uniqueUserIds) {
                RUserDuty rUserDuty = new RUserDuty();
                rUserDuty.setUserId(userId);
                rUserDuty.setDutyId(dutyId);
                rUserDuties.add(rUserDuty);
            }
        }
        insertBatch(rUserDuties);
    }

    /**
     * 撤销用户职责
     *
     * @param userId
     */
    public void revokeAllDuties(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is null");
        }
        Wrapper<RUserDuty> wrapper = new EntityWrapper<>();
        wrapper.eq("user_id", userId);
        delete(wrapper);
    }

    /**
     * 批量撤销用户的岗位职责
     *
     * @param userId
     * @param dutyIds
     */
    public void revokeDuties(Long userId, List<Long> dutyIds) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is null");
        }
        if (dutyIds == null || dutyIds.isEmpty()) {
            throw new IllegalArgumentException("dutyIds is null");
        }
        Wrapper<RUserDuty> wrapper = new EntityWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.in("duty_id", dutyIds);
        this.delete(wrapper);
    }

    public List<Long> findDutyIdsByUser(Long userId) {
        return rUserDutyDao.selectDutyIds(userId);
    }
}
