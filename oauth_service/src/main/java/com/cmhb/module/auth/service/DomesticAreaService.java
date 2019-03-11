package com.cmhb.module.auth.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.DomesticAreaDao;
import com.cmhb.module.auth.domain.DomesticAreaEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * <p>
 * 服务类
 * </p>
 * 
 * @author 陈强
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年9月29日 下午5:01:17
 */
@Slf4j
@Service
public class DomesticAreaService
		extends ServiceImpl<DomesticAreaDao, DomesticAreaEntity>
{
	@Resource
	private DomesticAreaDao domesticAreaDao;

	public Map<String, Object> getAreaTypes()
	{
		Map<String, Object> params = new HashMap<String, Object>();
		try
		{
			List<DomesticAreaEntity> domesticAreas = this.selectByMap(params);
			if (domesticAreas != null)
			{
				for (DomesticAreaEntity domesticArea : domesticAreas)
				{
					params.put(domesticArea.getCode(), domesticArea.getName());
				}
			}
		}
		catch (Exception e)
		{
			log.error("获取区域异常！");
		}
		return params;
	}

	public void updateByCode(DomesticAreaEntity domesticArea)
	{
		domesticAreaDao.updateByCode(domesticArea);
	}

	public String selectByCode(String code)
	{
		String name = "";
		if (StringUtils.isNotBlank(code))
		{
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("code", code);
			List<DomesticAreaEntity> areaTypeEntitys = this.selectByMap(params);
			if (areaTypeEntitys != null && areaTypeEntitys.size() != 0)
			{
				if (StringUtils.isNotBlank(areaTypeEntitys.get(0).getName()))
				{
					name = areaTypeEntitys.get(0).getName();
				}
			}
		}
		return name;
	}

	public String selectByName(String name)
	{
		String code = "";
		if (StringUtils.isNotBlank(name))
		{
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("name", name);
			List<DomesticAreaEntity> areaTypeEntitys = this.selectByMap(params);
			if (areaTypeEntitys != null && areaTypeEntitys.size() != 0)
			{
				if (StringUtils.isNotBlank(areaTypeEntitys.get(0).getCode()))
				{
					code = areaTypeEntitys.get(0).getCode();
				}
			}
		}
		return code;
	}

}
