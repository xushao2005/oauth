package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.dao.DepartmentDao;
import com.cmhb.module.auth.domain.Department;
import com.cmhb.module.auth.model.DepartmentModel;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService extends ServiceImpl<DepartmentDao, Department> {
    public boolean isNameUnique(Long id, String name) {
        if (name == null) {
            throw new IllegalArgumentException("name is null");
        }
        val ew = new EntityWrapper<Department>();
        ew.eq("name", name);
        val exist = this.selectOne(ew);

        // 指定名称的对象不存在，名称唯一
        if (exist == null) {
            return true;
        }

        // 新增时名称已存在，不唯一；编辑时名称已存在，且与当前编辑记录id不一样，不唯一
        return !(id == null || (id != null && !id.equals(exist.getId())));
    }

    public boolean isDepartmentValid(DepartmentModel departmentModel) {
        if (departmentModel == null) {
            return false;
        }
        if (StringUtils.isBlank(departmentModel.getName())) {
            return false;
        }

        //验证角色名是否重复
        return isNameUnique(departmentModel.getId(), departmentModel.getName());
    }
}
