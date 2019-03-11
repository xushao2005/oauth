package com.cmhb.module.auth.model;

import com.cmhb.module.auth.domain.Department;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.Position;
import com.cmhb.module.auth.domain.Role;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by luxp on 2017/8/10.
 */
@Data
public class UserModel {
    private Long id;
    private String loginName;
    private String password;
    private String confirmPasswd;
    private String username;
    private String email;
    private String phone;
    private String mobile;
    private String description;
    private Boolean sales;
    private Boolean checking;
    private Boolean receipt;
    private Boolean driver;
	private Boolean dataAdmin;
    private String branchCompany;
    private String branchCompanyName;
    private LocalDateTime resignTime;
    private LocalDateTime entryTime;
    private Boolean dutyStatus;
    private List<Role> roles;
    private List<Long> roleIds;

    private String oldPassword;

    private Long departmentId;
    private String departmentName;
    private Long positionId;
    private String positionName;
    private List<Duty> duties;
    private List<Long> dutyIds;

    private Long dutyId;
}

