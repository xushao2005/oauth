package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.DutyDao;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.RUserDuty;
import com.cmhb.module.auth.model.DutyModel;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DutyService extends ServiceImpl<DutyDao, Duty> {
    @Resource
    private DutyDao dutyDao;
    @Resource
    private RUserDutyService rUserDutyService;

    public List<Duty> findByPosition(Long positionId) {
        return dutyDao.findByPosition(positionId);
    }

    public List<Duty> findByUser(Long userId) {
        return dutyDao.findByUser(userId);
    }

    public boolean isDutyValid(DutyModel model) {
        if (model == null) {
            return false;
        }
        if (StringUtils.isBlank(model.getName())) {
            return false;
        }
        return true;
    }

    public void logoff(Long id, List<Long> userIds) {
        if (id == null) {
            throw new IllegalArgumentException("职责编码不能为空");
        }
        if (userIds == null || userIds.isEmpty()) {
            throw new IllegalArgumentException("员工编码不能为空");
        }
        //注销职责下的指定用户
        val ew = new EntityWrapper<RUserDuty>();
        ew.eq("duty_id", id);
        ew.in("user_id", userIds);
        rUserDutyService.delete(ew);
    }
}
