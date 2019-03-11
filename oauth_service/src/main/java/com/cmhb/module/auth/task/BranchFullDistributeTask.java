package com.cmhb.module.auth.task;


import com.alibaba.fastjson.JSON;
import com.cmhb.api.RequestWrapper;
import com.cmhb.api.ResponseWrapper;
import com.cmhb.common.exceptions.BusinessException;
import com.cmhb.common.utils.BeanReflactUtil;
import com.cmhb.enums.EntityTypeEnum;
import com.cmhb.module.auth.domain.Branch;
import com.cmhb.module.auth.service.BranchChangeLogService;
import com.cmhb.module.auth.service.BranchPushService;
import com.cmhb.module.auth.service.BranchService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午8:49:09
 */
@Slf4j
@Component
public class BranchFullDistributeTask
{
	
	@Resource
	private BranchChangeLogService branchChangeLogService;
	
	@Resource
	private BranchService branchService;
	
	@Resource
	private BranchPushService branchPushService;

	public void cron()
	{
		Thread.currentThread().setName("Task: branch change distribute "
				+ System.currentTimeMillis());
		val logs = branchChangeLogService.selectWhichNeedDistribute();
		RequestWrapper request = null;
		for (val changelog : logs)
		{
			val now = new Date();
			changelog.setMessage(null);
			ResponseWrapper responseWrapper = null;
			try
			{
				if (EntityTypeEnum.BRANCH.value()
						.equals(changelog.getEntity()))
				{
					String code = changelog.getBusinessCode();
					Branch branch = null;
					if (StringUtils.isNotBlank(code))
					{
						Map<String, Object> params = new HashMap<String, Object>();
						params.put("code", code);
						List<Branch> branchs = branchService
								.selectByMap(params);
						if (branchs != null && branchs.size() != 0)
						{
							branch = branchs.get(0);
						}
					}
					if (branch != null) {
						request = new RequestWrapper();
						request.setId(changelog.getId());
						request.setBusinessCode(changelog.getBusinessCode());
						request.setVersion(changelog.getCreateTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
						request.setType(changelog.getEntity());
						request.setMethod(changelog.getType());
						request.setBody(branch);
						responseWrapper = branchPushService.call(request);
						changelog.setSend(true);
					} else {
						changelog.setMessage("找不到该分公司信息");
					}
				}
				else
				{
					changelog.setMessage("未知的发布类型");
					log.info("ID: {}，未知的发布任务： {}", changelog.getId(),
							changelog.getEntity());
				}
			}
			catch (BusinessException e)
			{
				changelog.setMessage(e.getMessage());
			}
			catch (Exception e)
			{
				log.error("分公司信息变更远程发布失败", e);
				changelog.setMessage(e.getMessage());
			}
			// 默认值为失败，发送成功则设置为成功
			if (responseWrapper != null)
			{
				changelog.setSuccess(responseWrapper.isCallSucess());
				changelog.setMessage(responseWrapper.getMessage());
				log.info("response: {}", responseWrapper.toString());
			}
			else
			{
				changelog.setSuccess(false);
				if (changelog.getMessage() == null)
				{
					changelog.setMessage("错误的接口或者代码发布错误");
				}
			}
			branchChangeLogService.updateById(changelog);
		}
	}

}
