package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.MenuDao;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.domain.Role;
import com.cmhb.module.auth.enums.ResourceType;
import lombok.extern.slf4j.Slf4j;
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
public class PermissionService extends ServiceImpl<MenuDao, Control> {
    @Resource
    private MenuDao menuDao;
    @Resource
    private RoleService roleService;
    @Resource
    private RRoleMenuService rRoleMenuService;
    public MenuService menuService;

    /**
     * 获取用户角色API权限path
     *
     * @param userId 用户id
     *
     * @return
     */
    public Set<String> findPermsPathByUser(Long userId) {
        final Set<String> routerPerms = new HashSet<>();
        //todo 查询api权限
//        Set<Menu> perms = findPermsByUser(userId, ResourceType.API);
//        perms.forEach(perm -> routerPerms.add(perm.getPath()));
        return routerPerms;
    }

    /**
     * 查询资源
     *
     * @param userId
     * @param resourceType
     *
     * @return
     */
    public Set<Control> findPermsByUser(Long userId,
                                        ResourceType resourceType) {
        if (userId == null) {
            throw new IllegalArgumentException("用户id未指定");
        }
        if (resourceType == null) {
            throw new IllegalArgumentException("资源类型未指定");
        }

        final Set<Control> controls;
        if (ResourceType.MENU.equals(resourceType)) {
            controls = new TreeSet<>(
                    Comparator.comparing(Control::getId));
        } else {
            controls = new HashSet<>();
        }
        List<Role> roles = roleService.findRoleByUser(userId);
        // todo lambda stream
        roles.forEach((Role role) -> {
            List<Control> perms;
            if (ResourceType.ALL.equals(resourceType)) {
                perms = menuDao.selectPermByRoleId(role.getId(), null);
            } else {
                perms = menuDao.selectPermByRoleId(role.getId(),
                        resourceType.name());
            }
            controls.addAll(perms);
        });
        return controls;
    }

}
