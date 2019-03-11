package com.cmhb.module.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmhb.common.annotation.ActionDesc;
import com.cmhb.common.utils.TrimUtils;
import com.cmhb.module.auth.domain.DomesticAreaEntity;
import com.cmhb.module.auth.service.DomesticAreaService;
import com.cmhb.module.auth.service.PermissionService;

import lombok.NonNull;

/**
 * <p>
 * 区域 前端控制器
 * </p>
 * 
 * @author 陈强
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年9月30日 下午5:47:42
 */
@RestController
@RequestMapping("/domesticAreas")
@ActionDesc(desc = "国内区域管理", code = "ClientController")
@SuppressWarnings("rawtypes")
public class DomesticAreaController
{
	@Resource
	private PermissionService permissionService;
	@Autowired
	private DomesticAreaService domesticAreaService;

	@GetMapping("/page")
	public ResponseEntity pageList(@ModelAttribute DomesticAreaEntity search)
	{
		Map<String, Object> params = new HashMap<String, Object>();
		List<DomesticAreaEntity> domesticAreaEntitys = domesticAreaService
				.selectByMap(params);
		return new ResponseEntity<>(domesticAreaEntitys, HttpStatus.OK);
	}

	@GetMapping("/{code}")
	public ResponseEntity view(@PathVariable String code)
	{
		Map<String, Object> params = new HashMap<String, Object>();
		if (StringUtils.isNotBlank(code))
		{
			params.put("code", code);
			List<DomesticAreaEntity> list = domesticAreaService
					.selectByMap(params);
			if (list != null && list.size() != 0)
			{
				return new ResponseEntity<>(list.get(0), HttpStatus.OK);
			}
		}
		return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity create(@RequestBody DomesticAreaEntity domesticArea)
	{
		// todo 数据验证
		TrimUtils.trimObj(domesticArea);
		domesticAreaService.insert(domesticArea);
		return new ResponseEntity(HttpStatus.OK);
	}

	@PutMapping
	public ResponseEntity update(@RequestBody DomesticAreaEntity domesticArea)
	{
		// todo 数据验证
		// AreaTypeEntity entity = BeanMapper.map(domesticArea, AreaTypeEntity.class);
		domesticAreaService.updateByCode(domesticArea);
		return new ResponseEntity(HttpStatus.OK);
	}

	@DeleteMapping("/{code}")
	public ResponseEntity remove(@NonNull @PathVariable("code") String code)
	{
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("code", code);
		boolean i = domesticAreaService.deleteByMap(params);
		if (i)
		{
			return new ResponseEntity(HttpStatus.OK);
		}

		return new ResponseEntity(HttpStatus.NOT_FOUND);
	}

	@GetMapping("/unique/code")
	public boolean validCode(@RequestParam("code") String code)
	{
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("code", code);
		List<DomesticAreaEntity> domesticAreaEntitys = domesticAreaService
				.selectByMap(params);
		if (domesticAreaEntitys != null && domesticAreaEntitys.size() != 0)
		{
			return false;
		}
		return true;
	}

	@GetMapping("/unique/name")
	public boolean validName(
			@RequestParam(value = "code", required = false) String code,
			@RequestParam("name") String name)
	{
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("name", name);
		List<DomesticAreaEntity> domesticAreaEntitys = domesticAreaService
				.selectByMap(params);
		if (domesticAreaEntitys != null && domesticAreaEntitys.size() != 0)
		{
			if (StringUtils.isBlank(code))
			{
				return false;
			}
			for (DomesticAreaEntity domesticArea : domesticAreaEntitys)
			{
				if (!code.equals(domesticArea.getCode()))
				{
					return false;
				}
			}
		}

		return true;
	}

}
