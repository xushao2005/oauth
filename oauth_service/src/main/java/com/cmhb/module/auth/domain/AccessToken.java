package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * ${table.comment}
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
@Data
@TableName("auth_access_token")
public class AccessToken implements Serializable {

    private static final long serialVersionUID = 1L;

	/**
	 * 默认的 refresh_token 的有效时长: 30天
	 */
	public final static int REFRESH_TOKEN_VALIDITY_SECONDS = 60 * 60 * 24 * 30;

	/**
	 * 默认的 access_token 的有效时长: 12小时
	 */
    public final static int ACCESS_TOKEN_VALIDITY_SECONDS = 60 * 60 * 12 * 15;

    private Long id;
    private Long userId;
    private String clientSecret;
	private String accessToken;
	private String refreshToken;
    private LocalDateTime accessTokenExpiredTime;
    private LocalDateTime refreshTokenExpiredTime;
}
