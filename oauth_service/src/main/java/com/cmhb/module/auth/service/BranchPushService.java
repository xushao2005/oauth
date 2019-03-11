package com.cmhb.module.auth.service;


import com.cmhb.api.RequestWrapper;
import com.cmhb.api.ResponseWrapper;
import com.cmhb.common.okhttp.ApiJsonClient;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午10:41:57
 */
@Service
public class BranchPushService
{
	@Resource
	private ApiJsonClient<RequestWrapper, ResponseWrapper> branchApi;
	
	public ResponseWrapper call(RequestWrapper request) {
		return branchApi.call(request, ResponseWrapper.class);
	}

	public ResponseWrapper call(RequestWrapper request, String callUrl) {
		return branchApi.call(request, ResponseWrapper.class, callUrl);
	}
}
