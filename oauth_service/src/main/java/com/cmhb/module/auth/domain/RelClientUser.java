package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableName;
import com.cmhb.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * <p>
 * ${table.comment}
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
@Data
@TableName("auth_r_client_user")
public class RelClientUser implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private Long userId;
    private Long clientId;

}
