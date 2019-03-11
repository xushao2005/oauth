package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;

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
@TableName("auth_client")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER)
    private Long id;
    private String applicationName;
    private String description;
    private String secretKey;
    private String uri;
    private String icon;
    private String redirectUri;
    private String grantTypes;
    private String appId;

}
