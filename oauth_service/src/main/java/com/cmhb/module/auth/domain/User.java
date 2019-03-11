package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;
import com.cmhb.domain.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户
 * @author ${author}
 * @since 2017-08-07
 */
@Data
//@EqualsAndHashCode(callSuper = true)
@TableName("auth_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final int EXISTENT = 1;
    public static final int DELETED = 0;
    
    @TableId(type = IdType.AUTO)
    private Long id;
    private String loginName;
    private String password;
    private String username;
    private String email;
    private String phone;
    private String mobile;
    private String description;
	private Boolean sales;
    private Boolean checking;
    private Boolean receipt;
	private Boolean dataAdmin;
    private String branchCompany;
    @TableField(exist=false)
    private String branchCompanyName;
    private LocalDateTime resignTime;
    private LocalDateTime entryTime;
    private Boolean dutyStatus;
    private Boolean driver;
    @JsonIgnore
    @TableField(value = "status")
    private Integer status;
    @JsonIgnore
    @TableField(value = "add_time")
    private LocalDateTime addTime;
    @JsonIgnore
    @TableField(value = "mod_time")
    private LocalDateTime modTime;
    private Long departmentId;
    @TableField(exist=false)
    private String departmentName;
    private Long positionId;
}
