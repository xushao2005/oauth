package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.common.exceptions.ServiceException;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.dao.RoleDao;
import com.cmhb.module.auth.domain.Role;
import com.cmhb.module.auth.model.RoleModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

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
public class RoleService extends ServiceImpl<RoleDao, Role> {

    @Resource
    private RoleDao roleDao;

    /**
     * 查询用户角色
     *
     * @param userId
     *
     * @return
     */
    public List<Role> findRoleByUser(long userId) {
        List<Role> roles = roleDao.selectRoleByUserId(userId);
        return roles == null ? new ArrayList<>() : roles;
    }

    /**
     * 可选择的授权角色
     *
     * @param userId
     *
     * @return
     */
    public List<Role> findDisposableRoles(long userId) {
        List<Role> roles = findRoleByUser(userId);
        boolean isAdmin = roles.stream()
                .anyMatch(role -> role.getId() == 1);
        if (isAdmin) {
            roles = selectList(null);
        }

        return roles;
    }

    public List<Role> findPage(Page<Role> page, Map<String, Object> params) {
        List<Role> roleList = roleDao.selectPage(params, page);
        page.setRecords(roleList);
        return roleList;
    }

    public Map<String, Object> queryParam(RoleModel roleModel) {
        Map<String, Object> params = new HashMap<>();
        params.put("status", 1);
        if (roleModel == null) {
            return params;
        }

        if (roleModel.getId() != null) {
            params.put("id", roleModel.getId());
        }
        if (StringUtils.isNotBlank(roleModel.getName())) {
            params.put("name", roleModel.getName());
        }
        return params;
    }

    public boolean create(RoleModel roleModel) {
        Role role = BeanMapper.map(roleModel, Role.class);
        role.setStatus(1);
        return super.insert(role);
    }

    public boolean update(RoleModel roleModel) {
        Role role = BeanMapper.map(roleModel, Role.class);
        return updateById(role);
    }

    public boolean delete(Long id) {
        Role role = super.selectById(id);
        if (role == null) {
            return false;
        }
        if (role.getStatus().equals(0)) {
            return true;
        } else {
            role.setStatus(0);
            return super.updateById(role);
        }
    }

    /**
     * 验证新增role名称、备注是不为空 名称唯一
     *
     * @param roleModel
     *
     * @return
     */
    public boolean isRoleValid(RoleModel roleModel) {
        if (roleModel == null) {
            return false;
        }
        if (StringUtils.isBlank(roleModel.getName())) {
            return false;
        }

        //验证角色名是否重复
        return isNameUnique(roleModel.getId(), roleModel.getName());
    }

    /**
     * 验证roleId是否正确 存在
     *
     * @param roleId
     *
     * @return
     */
    public boolean isValid(Long roleId) {
        //todo 是否存在 对应的角色不存在则抛异常
        return roleId != null && isValid(Collections.singletonList(roleId));
    }

    public boolean isValid(List<Long> roleIds) {
        if (roleIds == null) {
            log.error("userId Set 参数不能为空");
            throw new IllegalArgumentException();
        }

        if (!roleIds.isEmpty()) {
            List<Role> roles = selectBatchIds(roleIds);
            if (roles == null ||
                    roles.size() != roleIds.size()) {
                throw new ServiceException("不存在角色");
            }
        }

        return true;
    }

    /**
     * 新增角色名是否唯一
     *
     * @param name
     *
     * @return
     */
    public boolean isNameUnique(String name) {
        if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("name is blank");
        }
        Wrapper<Role> params = new EntityWrapper<>();
        params.eq("name", name);
        return selectOne(params) == null;
    }

    /**
     * 更新角色名，校验角色名是否唯一
     * 角色名唯一，或者角色名没有修改
     *
     * @param roleId
     * @param name
     *
     * @return
     */
    public boolean isNameUnique(Long roleId, String name) {
        //todo 参照 ClientService#isRedirectUrlUnique()
        if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("name is blank");
        }

        boolean uniqueName = isNameUnique(name);
        if (uniqueName) {
            return true;
        }

        if (roleId != null) {
            Role role = selectById(roleId);
            if (role == null) {
                throw new IllegalArgumentException("roleId is not exist");
            }
            return role.getName().equals(name);
        }
        return false;
    }
}
