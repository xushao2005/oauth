package com.cmhb.module.auth.controller;

import com.baomidou.mybatisplus.toolkit.CollectionUtils;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.Position;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.model.PositionModel;
import com.cmhb.module.auth.service.DutyService;
import com.cmhb.module.auth.service.PositionService;
import com.cmhb.module.auth.service.RDepartmentPositionService;
import com.cmhb.module.auth.service.UserService;
import com.cmhb.module.oauth2.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class PositionController {
    @Resource
    private PositionService positionService;
    @Resource
    private RDepartmentPositionService rDepartmentPositionService;
    @Autowired
    private DutyService dutyService;
    @Autowired
    private UserService userService;

    @GetMapping("/positions")
    public List<Position> positions(PositionModel model) {
        return positionService.findByDepartment(model.getDepartmentId());
    }

    @PostMapping("/position")
    public void create(@RequestBody PositionModel model) {
        if (!positionService.isPositionValid(model)) {
            throw new RuntimeException("创建失败");
        }
        Position position = BeanMapper.map(model, Position.class);
        boolean b = positionService.insert(position);
        rDepartmentPositionService.grantDepartmentPosition(model.getDepartmentId(), position.getId());
        if (!b) {
            throw new RuntimeException("创建失败");
        }
    }

    @PutMapping("/position")
    public void update(@RequestBody PositionModel model) {
        if (!positionService.isPositionValid(model)) {
            throw new RuntimeException("更新失败");
        }
        Position position = BeanMapper.map(model, Position.class);
        boolean b = positionService.updateById(position);
        if (!b) {
            throw new RuntimeException("更新失败");
        }
    }

    @GetMapping("/position/{id}")
    public Position view(@PathVariable Long id) {
        return positionService.selectById(id);
    }

    @DeleteMapping("/position/{id}")
    public Result remove(@PathVariable Long id) {
        Result result = new Result();

        List<Duty> duties = dutyService.findByPosition(id);
        if (CollectionUtils.isNotEmpty(duties)) {
            result.setSuccessful(false);
            result.setMsg("该岗位还存在工作职责, 不能删除");
            return result;
        }

        List<User> users = userService.listByPosition(id);
        if (CollectionUtils.isNotEmpty(users)) {
            result.setSuccessful(false);
            result.setMsg("该岗位还有绑定的员工, 不能删除");
            return result;
        }

        positionService.deleteById(id);
        rDepartmentPositionService.deletePosition(id);
        return result;
    }

    @PutMapping("/position/logoffUsers")
    public void logoff(@RequestBody PositionModel model) {
        positionService.logoff(model.getId(), model.getUserIds());
    }


    @GetMapping("/position/unique/name")
    public boolean vaildName(@RequestParam(value = "id", required = false) Long id, @RequestParam("name") String name) {
        return positionService.isNameUnique(id, name);
    }
}
