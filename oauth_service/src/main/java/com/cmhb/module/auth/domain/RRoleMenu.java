package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * <p>
 * <p>
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
@Data
@TableName("auth_r_role_control")
public class RRoleMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private Long roleId;
    private Long controlId;
    private Long clientId;
}
