package com.cmhb.module.auth.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.cmhb.api.ResponseWrapper;
import com.cmhb.common.annotation.CurrentUser;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.common.utils.MD5Util;
import com.cmhb.common.utils.StringHelper;
import com.cmhb.enums.EntityTypeEnum;
import com.cmhb.enums.MethodTypeEnum;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.RUserDuty;
import com.cmhb.module.auth.domain.Role;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.model.UserConnectDutyModel;
import com.cmhb.module.auth.model.UserModel;
import com.cmhb.module.auth.service.*;
import com.cmhb.module.employee.domain.EmployeeChangeLog;
import com.cmhb.module.employee.service.EmployeeChangeLogService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
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
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;
    @Resource
    private RUserRoleService rUserRoleService;
    @Resource
    private EmployeeChangeLogService employeeChangeLogService;
    @Resource
    private BranchService branchService;
    @Resource
    private DepartmentService departmentService;
    @Resource
    private PositionService positionService;
    @Resource
    private DutyService dutyService;
    @Resource
    private RUserDutyService rUserDutyService;

    @GetMapping("/page")
    public Page list(Page<User> page,
                     @ModelAttribute UserModel userModel) {
        userService.findPage(page, userModel);
        return page;
    }

//    @GetMapping("/position/{positionId}")
//    public List<User> list(@PathVariable Long positionId) {
//        if (positionId == null) {
//            return Collections.EMPTY_LIST;
//        }
//        User query = new User();
//        query.setPositionId(positionId);
//        return userService.selectList(new EntityWrapper<>(query));
//    }

    @GetMapping("/{id}")
    public UserModel view(@PathVariable @NonNull Long id) {
        User user = userService.findUser(id);
        //todo 密码序列化忽略
        user.setPassword(null);
        UserModel userModel = BeanMapper.map(user, UserModel.class);
        //返回用户角色id列表
        List<Long> roleIds = rUserRoleService.findRoleIdByUser(id);
        userModel.setRoleIds(roleIds);

        if (StringUtils.isNotBlank(user.getBranchCompany())) {
            userModel.setBranchCompanyName(
                    branchService.findByCode(user.getBranchCompany()));
        }
        if (null != user.getDepartmentId()) {
            val department = departmentService.selectById(user.getDepartmentId());
            if (null != department) {
                userModel.setDepartmentName(department.getName());
            }
        }
        if (null != user.getPositionId()) {
            val position = positionService.selectById(user.getPositionId());
            if (null != position) {
                userModel.setPositionName(position.getName());
            }
        }

        List<Long> dutyIds = rUserDutyService.findDutyIdsByUser(user.getId());
        if (dutyIds != null && !dutyIds.isEmpty()) {
            userModel.setDutyIds(dutyIds);
        }
        return userModel;
    }

    @GetMapping("/{id}/roles")
    public List roles(@PathVariable Long id) {
        List<Role> roles = roleService.findRoleByUser(id);
        return roles;
    }

    @GetMapping("/{id}/duties")
    public List<Duty> duties(@PathVariable Long id) {
        return dutyService.findByUser(id);
    }

    @PostMapping
    public void update(@RequestBody UserModel userModel) {
        if (!userService.isUserValid(userModel)) {
            throw new RuntimeException("数据错误，不允许更新");
        }

        User user = userService.findUser(userModel.getId());
        checkBranchCompanyName(userModel, user);
        userService.update(userModel);

        EmployeeChangeLog changelog = new EmployeeChangeLog();
        changelog.setId(StringHelper.getPkid());
        changelog.setEntity(EntityTypeEnum.EMPLOYEE.value());
        changelog.setType(MethodTypeEnum.UPDATE.value());
        changelog.setBusinessCode(userModel.getId());
        changelog.setStatus(0);
        employeeChangeLogService.insert(changelog);

        //前端不触发tree事件，roleIds为null
        if (userModel.getRoleIds() != null) {
            //撤销原先角色
            rUserRoleService.revokeAllRoles(userModel.getId());
            //新增角色
            rUserRoleService.grantUserRoles(userModel.getId(), userModel.getRoleIds());
        }

        if (userModel.getDutyIds() != null) {
            //撤销原先岗位职责
            rUserDutyService.revokeAllDuties(userModel.getId());
            //新增岗位职责
            rUserDutyService.grantUserDuties(userModel.getId(), userModel.getDutyIds());
        }

        if (null == userModel.getPositionId()) {
            //撤销原先岗位职责
            rUserDutyService.revokeAllDuties(userModel.getId());
        }

        if (null != user.getPositionId() && !user.getPositionId().equals(userModel.getPositionId())) {
            //撤销原先岗位职责
            rUserDutyService.revokeAllDuties(userModel.getId());
        }
    }

    private void checkBranchCompanyName(UserModel userModel, User user) {
        if (userModel == null || user == null
                || StringUtils.isBlank(user.getBranchCompany())) {
            return;
        }
        if (StringUtils.isBlank(userModel.getBranchCompany())) {
            userModel.setBranchCompany("");
            return;
        }
        String name = branchService.findByCode(user.getBranchCompany());
        name = name == null ? "" : name;
        if (name.equals(userModel.getBranchCompany())) {
            userModel.setBranchCompany(user.getBranchCompany());
        }
    }

    @PutMapping("/password")
    public ResponseWrapper modifyPassword(@RequestBody UserModel userModel) {
        if (!userService.isUserValid(userModel)) {
            throw new RuntimeException("数据错误，不允许更新");
        }

        ResponseWrapper ret = new ResponseWrapper();
        User user = userService.findUser(userModel.getId());
        String oldPasswordMd5 = MD5Util.md5(userModel.getOldPassword());
        if (!oldPasswordMd5.equals(user.getPassword())) {
            ret.setCallSucess(false);
            ret.setMessage("旧密码输入有误，修改失败!");
            return ret;
        }
        boolean successful = userService.changePasswd(userModel);
        if (successful) {
            EmployeeChangeLog changelog = new EmployeeChangeLog();
            changelog.setId(StringHelper.getPkid());
            changelog.setEntity(EntityTypeEnum.EMPLOYEE.value());
            changelog.setType(MethodTypeEnum.UPDATE.value());
            changelog.setBusinessCode(userModel.getId());
            changelog.setStatus(0);
            employeeChangeLogService.insert(changelog);

            ret.setCallSucess(true);
            ret.setMessage("密码修改成功!");
        } else {
            ret.setCallSucess(false);
            ret.setMessage("密码修改失败，请稍后重试!");
        }
        return ret;
    }

    @PutMapping
    public void create(@RequestBody UserModel userModel) {
        if (!userService.isUserValid(userModel)) {
            throw new RuntimeException("创建失败");
        }
        // userModel.setId(IdWorker.getId()); 
        userService.create(userModel);

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("username", userModel.getUsername());
        List<User> list = userService.selectByMap(params);
        if (list != null && list.size() != 0) {
            User user = list.get(0);

            EmployeeChangeLog changelog = new EmployeeChangeLog();
            changelog.setId(StringHelper.getPkid());
            changelog.setEntity(EntityTypeEnum.EMPLOYEE.value());
            changelog.setType(MethodTypeEnum.NEW.value());
            changelog.setBusinessCode(user.getId());
            changelog.setStatus(0);
            employeeChangeLogService.insert(changelog);

            user.setLoginName(user.getId() + "");
            userService.updateById(user);
        }


        //授予用户角色
        rUserRoleService.grantUserRoles(userModel.getId(), userModel.getRoleIds());
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        userService.delete(id);
    }

    /**
     * 授予用户角色权限
     *
     * @param userModel
     *
     * @return
     */
    @PostMapping("/bindRoles")
    public void grantRoles(@RequestBody UserModel userModel) {
        Long userId = userModel.getId();
        List<Long> roleIds = userModel.getRoleIds();
        if (roleIds != null) {
            //todo 验证
            userService.isValid(userId);
            roleService.isValid(roleIds);
            rUserRoleService.revokeAllRoles(userId);
            rUserRoleService.grantUserRoles(userId, roleIds);
        }
    }

    @GetMapping("/unique/loginName")
    public boolean validName(@RequestParam(value = "id", required = false) Long id,
                             @RequestParam("loginName") String loginName) {
        //todo 修改时 验证名称是否唯一
        boolean nameUnique = userService.isLoginNameUnique(id, loginName);
        return nameUnique;
    }

    @GetMapping("/unique/employeeName")
    public boolean validEmployeeName(@RequestParam(value = "id", required = false) Long id,
                                     @RequestParam("employeeName") String employeeName) {
        //todo 修改时 验证名称是否唯一
        boolean nameUnique = userService.isEmployeeNameUnique(id, employeeName);
        return nameUnique;
    }

    @GetMapping("/current/disposableRoles")
    public List currentRoles(@CurrentUser Long userId) {
        Role params = new Role();
        params.setStatus(1);
        Wrapper<Role> wrapper = new EntityWrapper<>(params);
        List<Role> roles = roleService.selectList(wrapper);
        return roles;
    }

    /**
     * 修改登录信息
     *
     * @param userModel
     */
    @PostMapping("/changeAuthInfo")
    public void changeAuthInfo(@RequestBody UserModel userModel) {
        userService.changeAuthInfo(userModel);
    }

    /*** 登记离职  **/
    @GetMapping("/removeDutyStatus")
    public void removeDutyStatus(@RequestParam("id") Long id) {
        User user = userService.findUser(id);
        user.setDutyStatus(false);
        userService.updateById(user);

        EmployeeChangeLog changelog = new EmployeeChangeLog();
        changelog.setId(StringHelper.getPkid());
        changelog.setEntity(EntityTypeEnum.EMPLOYEE.value());
        changelog.setType(MethodTypeEnum.UPDATE.value());
        changelog.setBusinessCode(user.getId());
        changelog.setStatus(0);
        employeeChangeLogService.insert(changelog);

    }

    /*** 重新入职  **/
    @GetMapping("/addDutyStatus")
    public void addDutyStatus(@RequestParam("id") Long id) {
        User user = userService.findUser(id);
        user.setDutyStatus(true);
        userService.updateById(user);

        EmployeeChangeLog changelog = new EmployeeChangeLog();
        changelog.setId(StringHelper.getPkid());
        changelog.setEntity(EntityTypeEnum.EMPLOYEE.value());
        changelog.setType(MethodTypeEnum.UPDATE.value());
        changelog.setBusinessCode(user.getId());
        changelog.setStatus(0);
        employeeChangeLogService.insert(changelog);
    }

    @GetMapping(value = "/auto-complete")
    public Object userAutoComplete(Long positionId, String q) {
        return userService.autoComplete(positionId, q);
    }

    //岗位规划员工与工作职责关联
    @PostMapping("/connect/duty")
    public Boolean userConnectDuty(@RequestBody UserConnectDutyModel model) {
        Boolean result = true;

        for (Long item: model.getUsers()) {
            //todo user信息判断
            User user = userService.findUser(item);
            if (null == user) {
                return false;
            }
            List ids = rUserDutyService.findDutyIdsByUser(item);

            if (!ids.contains(Long.parseLong(model.getDutyId()))) {
                RUserDuty ru = new RUserDuty();
                ru.setUserId(item);
                ru.setDutyId(Long.parseLong(model.getDutyId()));
                rUserDutyService.insert(ru);
            }
        }

        return result;
    }


}
