package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RDepartmentPositionDao;
import com.cmhb.module.auth.domain.RDepartmentPosition;
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
public class RDepartmentPositionService extends ServiceImpl<RDepartmentPositionDao, RDepartmentPosition> {
    @Resource
    private RDepartmentPositionDao rDepartmentPositionDao;

    /**
     * 部门添加岗位
     *
     * @param positionId
     * @param departmentId
     */
    public void grantDepartmentPosition(Long departmentId, Long positionId) {
        if (departmentId == null || positionId == null) {
            return;
        }

        RDepartmentPosition rDepartmentPosition = new RDepartmentPosition();
        rDepartmentPosition.setDepartmentId(departmentId);
        rDepartmentPosition.setPositionId(positionId);
        rDepartmentPositionDao.insert(rDepartmentPosition);
    }

    public void deletePosition(Long positionId) {
        if (positionId == null) {
            throw new IllegalArgumentException("岗位编码错误");
        }

        RDepartmentPosition params = new RDepartmentPosition();
        params.setPositionId(positionId);
        delete(new EntityWrapper<>(params));
    }
}

