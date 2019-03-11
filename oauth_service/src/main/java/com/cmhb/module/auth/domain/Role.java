package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableName;
import com.cmhb.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

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
@EqualsAndHashCode(callSuper = true)
@TableName("auth_role")
public class Role extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private String description;
}
