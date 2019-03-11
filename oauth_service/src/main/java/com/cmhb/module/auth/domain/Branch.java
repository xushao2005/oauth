package com.cmhb.module.auth.domain;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 分公司管理表
 * 
 * @author 陈强
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年9月29日 上午11:00:39
 */
@Data
@TableName("auth_branch")
public class Branch  implements Serializable
{
	private static final long serialVersionUID = 1L;

	@JSONField(serialize = false)
	@TableId(value = "id", type = IdType.AUTO)
	private Long id;

	/** 公司编码 **/
	@JSONField(name = "id")
	private String code;

	/** 公司名称 **/
	private String name;

	/** 名称拼音 **/
	@JSONField(name = "WarehousePinYin")
	private String nameSpell;
	
	/** 区域编码 **/
	private String areaCode;

	/** 区域名称 **/
	private String area;

	/** 调拨城市编码 **/
	private String warehouseCode;

	/** 电子秤波特率 **/
	private Integer baudRate;

	/** 客户所在区 **/
	private String isBelong;

	/** 菜鸟仓编号 **/
	private String cainiaoWarehouseCode;

	/** 拼音+仓号 **/
	private String abbreviationName;

	/** 是否启用 **/
	private Boolean statusId;
	
	private Integer status;
	
	private LocalDateTime addTime;
	
	private LocalDateTime modTime;

	private Boolean settle;

    private String settleCompanyCode;

    @TableField(exist = false)
    private String settleCompanyName;
}
