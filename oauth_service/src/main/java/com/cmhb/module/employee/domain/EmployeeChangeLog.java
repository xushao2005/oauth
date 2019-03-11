package com.cmhb.module.employee.domain;

import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午10:56:52
 */

@TableName("tc_employee_change_log")
@Data
public class EmployeeChangeLog
{
	private String id;
	// 变更业务所属业务编号
	private Long businessCode;
	// 变更业务对象类型
	private String entity;
	// 业务变更类型
	private String type;
	// 是否已发送过
	private Boolean send = false;
	// 是否发送成功
	private Boolean success = false;
	private LocalDateTime createTime;
	private LocalDateTime modifyTime;
	private Integer status;
	private String message;
}
