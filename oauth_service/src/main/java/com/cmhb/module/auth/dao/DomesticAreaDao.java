package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.DomesticAreaEntity;

/**
 * <p>
 * Mapper 接口
 * </p>
 * 
 * @author 陈强
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年9月29日 下午4:59:27
 */
public interface DomesticAreaDao extends BaseMapper<DomesticAreaEntity>
{
	void updateByCode(DomesticAreaEntity areaType);
}
