package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.dao.BranchDao;
import com.cmhb.module.auth.domain.Branch;
import com.cmhb.module.auth.model.BranchModel;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author ${author}
 * @since 2017-08-30
 */
@Service
public class BranchService extends ServiceImpl<BranchDao, Branch> {
    @Resource
    private BranchDao branchDao;

    public List<Branch> findPage(Page<Branch> page, Map<String, Object> params) {
        List<Branch> branches = branchDao.selectPage(params, page);
        page.setRecords(branches);
        return branches;
    }

    public Branch findById(Long id) {
        Branch branch = selectById(id);
        if (branch == null || branch.getStatus() == 0) {
            throw new IllegalArgumentException("不存在");
        }
        return branch;
    }

    public boolean create(BranchModel branchModel) {
        Branch branch = BeanMapper.map(branchModel, Branch.class);
        branch.setStatus(1);
        // todo 代替已逻辑删除数据
        return super.insertOrUpdate(branch);
    }

    public boolean update(BranchModel branchModel) {
        Branch branch = BeanMapper.map(branchModel, Branch.class);
        return super.updateById(branch);
    }

    /**
     * 唯一性判断
     *
     * @param id            添加时为空，编辑时不为空
     * @param code          公司编码
     * @param name          公司名称
     * @param warehouseCode 调拨城市编码
     *
     * @return 不存在返回 true, 存在返回false
     *
     * @author 陈强
     * @since 2017年10月11日 上午10:45:12
     */
    public boolean unique(Long id, String code, String name,
                          String warehouseCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        if (StringUtils.isNotBlank(code)) {
            params.put("code", code);
        }
        if (StringUtils.isNotBlank(name)) {
            params.put("name", name);
        }
        if (StringUtils.isNotBlank(warehouseCode)) {
            params.put("warehouse_Code", warehouseCode);
        }
        if (params.size() == 0) {
            return true;
        }
        List<Branch> branchs = this.selectByMap(params);
        if (branchs != null && branchs.size() != 0) {
            if (id == null) {
                return false;
            }
            for (Branch branch : branchs) {
                if (!id.equals(branch.getId())) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 通过分公司编码返回分公司名称
     *
     * @param code 分公司编码
     *
     * @return 分公司名称
     *
     * @author 陈强
     * @since 2017年10月16日 上午10:02:51
     */
    public String findByCode(String code) {
        // 分公司名称
        String name = "";
        Map<String, Object> params = new HashMap<String, Object>();
        if (StringUtils.isNotBlank(code)) {
            params.put("code", code);
            List<Branch> branchs = this.selectByMap(params);
            if (branchs != null && branchs.size() != 0) {
                for (Branch branch : branchs) {
                    if (StringUtils.isNotBlank(branch.getName())) {
                        name = branch.getName();
                    }
                }
            }
        }
        return name;
    }

    public Branch findBranchByCode(String code) {
        Branch params = new Branch();
        params.setCode(code);
        EntityWrapper<Branch> wrapper = new EntityWrapper<>(params);
        return selectOne(wrapper);
    }

    public void updateSettleCompany(String oldSettleCompanyCode, String newSettleCompanyCode) {
        Branch entity = new Branch();
        entity.setSettleCompanyCode(newSettleCompanyCode);
        entity.setModTime(LocalDateTime.now());

        Branch params = new Branch();
        params.setSettleCompanyCode(oldSettleCompanyCode);
        EntityWrapper<Branch> wrapper = new EntityWrapper<>(params);
        update(entity, wrapper);
    }

}
