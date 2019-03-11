package com.cmhb.module.auth.domain;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotations.TableName;

import lombok.Data;

/**
 * 区域表
 * 
 * @author 陈强
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年9月29日 下午4:51:01
 */
@Data
@TableName("auth_domestic_area")
public class DomesticAreaEntity implements Serializable
{
	private static final long serialVersionUID = -3789867898019540234L;

	/** 国内区域编码 */
	private String code;

	/** 国内区域名称 */
	private String name;
}
