package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.Position;

import java.util.List;

public interface PositionDao extends BaseMapper<Position> {
    List<Position> findByDepartment(Long departmentId);
}
