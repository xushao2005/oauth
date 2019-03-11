package com.cmhb.module.employee.domain;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
	private Long id;
	private String name;
	
	private String description;
	private Boolean sales;
	private Boolean checking;
	private Boolean receipt;
	private Boolean driver;
	
	private String password;
	
	/**分公司*/
	private String branchCompany;
	
	/**在职状态*/
	private	Boolean dutyStatus;

	/**入职时间*/
	private LocalDateTime entryTime;

	/**更新时间*/
	private LocalDateTime modifyTime;
}
