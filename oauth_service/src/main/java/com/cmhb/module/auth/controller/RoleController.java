package com.cmhb.module.auth.controller;

import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.toolkit.IdWorker;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.domain.Role;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.model.RoleModel;
import com.cmhb.module.auth.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
@RestController
@RequestMapping("/role")
public class RoleController {

    @Resource
    private RoleService roleService;
    @Resource
    private UserService userService;
    @Resource
    private RUserRoleService rUserRoleService;
    @Resource
    private MenuService menuService;
    @Resource
    private RRoleMenuService rRoleMenuService;

    @GetMapping("/page")
    public Page<Role> list(Page<Role> page, RoleModel roleModel) {
        Map<String, Object> params = roleService.queryParam(roleModel);
        roleService.findPage(page, params);
        return page;
    }

    @GetMapping("/{id}")
    public Role view(@PathVariable Long id) {
        Role role = roleService.selectById(id);
        return role;
    }

    @PutMapping
    public void update(@RequestBody RoleModel roleModel) {
        if (!roleService.isRoleValid(roleModel)) {
            throw new RuntimeException("更新失败");
        }
        boolean update = roleService.update(roleModel);
        rRoleMenuService.grantRolePerm(roleModel.getMenuIds(), roleModel.getClientId(), roleModel.getId());
        if (!update) {
            throw new RuntimeException("更新失败");
        }
    }

    @PostMapping
    public void create(@RequestBody RoleModel roleModel) {
        if (!roleService.isRoleValid(roleModel)) {
            throw new RuntimeException("创建失败");
        }
        roleModel.setId(IdWorker.getId());
        boolean insert = roleService.create(roleModel);
        rRoleMenuService.grantRolePerm(roleModel.getMenuIds(), roleModel.getClientId(), roleModel.getId());
        if (!insert) {
            throw new RuntimeException("创建失败");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity remove(@PathVariable Long id) {
        return new ResponseEntity<>(roleService.delete(id), HttpStatus.OK);
    }

    @PostMapping("/users")
    public void bindUsers(@RequestBody RoleModel roleModel) {
        Long roleId = roleModel.getId();
        List<Long> userIds = roleModel.getUserIds();
        roleService.isValid(roleId);
        userService.isValid(userIds);
        rUserRoleService.grantUsersRole(userIds, roleId);
    }

    @GetMapping("/unique/name")
    public boolean validName(@RequestParam(value = "id", required = false) Long id,
                             @RequestParam("name") String name) {
        return roleService.isNameUnique(id, name);
    }

    /**
     * 角色在拥有的权限
     *
     * @param roleId
     * @param clientId
     *
     * @return
     */
    @GetMapping("/{roleId}/{clientId}/controls")
    public List<ControlModel> clientPerms(@PathVariable("roleId") Long roleId, @PathVariable("clientId") Long clientId) {
        List<Control> controls = menuService.findByRoleAndClient(roleId, clientId, ResourceType.ALL);
        return menuService.convertMenu(controls);
    }

}