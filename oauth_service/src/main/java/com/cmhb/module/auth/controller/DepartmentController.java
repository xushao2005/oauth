package com.cmhb.module.auth.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.domain.Department;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.model.DepartmentModel;
import com.cmhb.module.auth.service.DepartmentService;
import com.cmhb.module.auth.service.MenuService;
import com.cmhb.module.auth.service.RDepartmentMenuService;
import lombok.val;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/department")
public class DepartmentController {
    @Resource
    private DepartmentService departmentService;
    @Resource
    private RDepartmentMenuService rDepartmentMenuService;
    @Resource
    private MenuService menuService;

    @GetMapping
    public List<Department> departments() {
        val ew = new EntityWrapper<Department>();
        ew.orderBy("seq");
        return departmentService.selectList(ew);
    }

    @GetMapping("/{id}")
    public Department view(@PathVariable Long id) {
        return departmentService.selectById(id);
    }

    @PostMapping
    public void create(@RequestBody DepartmentModel departmentModel) {
        if (!departmentService.isDepartmentValid(departmentModel)) {
            throw new RuntimeException("创建失败");
        }
        Department department = BeanMapper.map(departmentModel, Department.class);
        boolean b = departmentService.insert(department);
        rDepartmentMenuService.grantDepartmentPerm(departmentModel.getMenuIds(), departmentModel.getClientId(), department.getId());
        if (!b) {
            throw new RuntimeException("创建失败");
        }
    }

    @PutMapping
    public void update(@RequestBody DepartmentModel departmentModel) {
        if (!departmentService.isDepartmentValid(departmentModel)) {
            throw new RuntimeException("更新失败");
        }
        Department department = BeanMapper.map(departmentModel, Department.class);
        boolean b = departmentService.updateById(department);
        rDepartmentMenuService.grantDepartmentPerm(departmentModel.getMenuIds(), departmentModel.getClientId(), department.getId());
        if (!b) {
            throw new RuntimeException("更新失败");
        }
    }

    /**
     * 部门拥有的权限
     *
     * @param departmentId
     * @param clientId
     *
     * @return
     */
    @GetMapping("/{departmentId}/{clientId}/controls")
    public List<ControlModel> clientPerms(@PathVariable("departmentId") Long departmentId, @PathVariable("clientId") Long clientId) {
        List<Control> controls = menuService.findByDepartmentAndClient(departmentId, clientId, ResourceType.ALL);
        return menuService.convertMenu(controls);
    }


    @GetMapping("/unique/name")
    public boolean validName(@RequestParam(value = "id", required = false) Long id,
                             @RequestParam("name") String name) {
        return departmentService.isNameUnique(id, name);
    }
}
