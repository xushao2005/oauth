package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.PositionDao;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.Position;
import com.cmhb.module.auth.model.PositionModel;
import com.cmhb.module.oauth2.model.Result;
import lombok.extern.log4j.Log4j;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j
public class PositionService extends ServiceImpl<PositionDao, Position> {
    @Resource
    private PositionDao positionDao;
    @Resource
    private UserService userService;
    @Resource
    private RUserDutyService rUserDutyService;
    @Resource
    private DutyService dutyService;

    public boolean isNameUnique(Long id, String name) {
        if (name == null) {
            throw new IllegalArgumentException("name is null");
        }
        val ew = new EntityWrapper<Position>();
        ew.eq("name", name);
        val exist = this.selectOne(ew);

        // 指定名称的对象不存在，名称唯一
        if (exist == null) {
            return true;
        }

        // 新增时名称已存在，不唯一；编辑时名称已存在，且与当前编辑记录id不一样，不唯一
        return !(id == null || (id != null && !id.equals(exist.getId())));
    }

    public List<Position> findByDepartment(Long departmentId) {
        return positionDao.findByDepartment(departmentId);
    }

    public boolean isPositionValid(PositionModel model) {
        if (model == null) {
            return false;
        }
        if (StringUtils.isBlank(model.getName())) {
            return false;
        }
        if (model.getDepartmentId() == null) {
            return false;
        }

        //验证角色名是否重复
        return isNameUnique(model.getId(), model.getName());
    }

    public void logoff(Long id, List<Long> userIds) {
        if (id == null) {
            throw new IllegalArgumentException("岗位编码不能为空");
        }
        if (userIds == null || userIds.isEmpty()) {
            throw new IllegalArgumentException("员工编码不能为空");
        }
        //注销岗位下的用户
        userService.logoffPosition(id, userIds);
        //查询该岗位下的岗位职责列表
        val duties = dutyService.findByPosition(id);
        if (duties != null && !duties.isEmpty()) {
            val dutyIds = duties.stream().map(Duty::getId).collect(Collectors.toList());
            //注销所有用户关联的此岗位下的岗位职责
            for (Long userId : userIds) {
                rUserDutyService.revokeDuties(userId, dutyIds);
            }
        }
    }
}
