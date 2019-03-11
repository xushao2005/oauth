package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.Duty;

import java.util.List;

public interface DutyDao extends BaseMapper<Duty> {
    List<Duty> findByPosition(Long positionId);
    List<Duty> findByUser(Long userId);
}
