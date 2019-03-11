package com.cmhb.module.auth.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.RUserDuty;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.model.DutyModel;
import com.cmhb.module.auth.model.PositionModel;
import com.cmhb.module.auth.service.*;
import lombok.val;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class DutyController {
    @Resource
    private DutyService dutyService;
    @Resource
    private RPositionDutyService rPositionDutyService;
    @Resource
    private RDutyMenuService rDutyMenuService;
    @Resource
    private MenuService menuService;
    @Resource
    private RUserDutyService rUserDutyService;

    @GetMapping("/duties")
    public List<Duty> duties(DutyModel model) {
        return dutyService.findByPosition(model.getPositionId());
    }

    @PostMapping("/duty")
    public void create(@RequestBody DutyModel model) {
        if (!dutyService.isDutyValid(model) || model.getPositionId() == null) {
            throw new RuntimeException("创建失败");
        }
        Duty duty = BeanMapper.map(model, Duty.class);
        boolean b = dutyService.insert(duty);
        rPositionDutyService.grantPositionDuty(model.getPositionId(), duty.getId());
        if (!b) {
            throw new RuntimeException("创建失败");
        }
    }

    @PutMapping("/duty")
    public void update(@RequestBody DutyModel dutyModel) {
        if (!dutyService.isDutyValid(dutyModel)) {
            throw new RuntimeException("更新失败");
        }
        Duty duty = BeanMapper.map(dutyModel, Duty.class);
        boolean b = dutyService.updateById(duty);
        rDutyMenuService.grantDutyPerm(dutyModel.getId(), dutyModel.getClientId(), dutyModel.getMenuIds());
        if (!b) {
            throw new RuntimeException("更新失败");
        }
    }

    @GetMapping("/duty/{id}")
    public Duty view(@PathVariable Long id) {
        return dutyService.selectById(id);
    }

    @DeleteMapping("/duty/{id}")
    public void remove(@PathVariable Long id) {
        if (id == null) {
            throw new RuntimeException("删除失败");
        }
        RUserDuty query = new RUserDuty();
        query.setDutyId(id);
        val count = rUserDutyService.selectCount(new EntityWrapper<>(query));
        if (count > 0) {
            throw new RuntimeException("删除失败，该职责存在关联员工");
        }
        boolean b = dutyService.deleteById(id);
        rDutyMenuService.revokeAllPerms(id);
        rPositionDutyService.revokePositionDuty(id);
        if (!b) {
            throw new RuntimeException("删除失败");
        }
    }

    /**
     * 岗位职责拥有的权限
     *
     * @param dutyId
     * @param clientId
     *
     * @return
     */
    @GetMapping("/duty/{dutyId}/{clientId}/controls")
    public List<ControlModel> clientPerms(@PathVariable("dutyId") Long dutyId, @PathVariable("clientId") Long clientId) {
        List<Control> controls = menuService.findByDutyAndClient(dutyId, clientId, ResourceType.ALL);
        return menuService.convertMenu(controls);
    }

    @PutMapping("/duty/logoffUsers")
    public void logoff(@RequestBody DutyModel model) {
        dutyService.logoff(model.getId(), model.getUserIds());
    }
}
