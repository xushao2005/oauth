package com.cmhb.module.employee.service;

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
 * @since 2017年6月26日 下午11:01:45
 */
@Service
public class EmployeePushService
{
	@Resource
	private ApiJsonClient<RequestWrapper, ResponseWrapper> employeeApi;
	
	public ResponseWrapper call(RequestWrapper request) {
		return employeeApi.call(request, ResponseWrapper.class);
	}

}
