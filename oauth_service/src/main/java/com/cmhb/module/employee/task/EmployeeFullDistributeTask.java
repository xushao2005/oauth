package com.cmhb.module.employee.task;

import com.cmhb.api.RequestWrapper;
import com.cmhb.api.ResponseWrapper;
import com.cmhb.common.exceptions.BusinessException;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.enums.EntityTypeEnum;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.service.UserService;
import com.cmhb.module.employee.domain.Employee;
import com.cmhb.module.employee.service.EmployeeChangeLogService;
import com.cmhb.module.employee.service.EmployeePushService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.time.ZoneId;
import java.util.Date;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午11:07:56
 */
@Slf4j
@Component
public class EmployeeFullDistributeTask
{
	
	@Resource
	EmployeeChangeLogService employeeChangeLogService;	
	
	@Resource
	UserService userService;
	
	@Resource
	EmployeePushService employeePushService;
	public void cron()
	{
		Thread.currentThread().setName("Task: product change distribute "
				+ System.currentTimeMillis());
		val logs = employeeChangeLogService.selectWhichNeedDistribute();
		for (val changelog : logs)
		{
			val now = new Date();
			changelog.setMessage(null);
			ResponseWrapper responseWrapper = null;
			try
			{
				if (EntityTypeEnum.EMPLOYEE.value()
						.equals(changelog.getEntity()))
				{
					val id = changelog.getBusinessCode();
					val user = userService.findUser(id);
					if (user != null) {
						val employee = this.transToEmployee(user);
						val request = new RequestWrapper();
						request.setId(changelog.getId());
						request.setBusinessCode(changelog.getBusinessCode());
						request.setVersion(changelog.getCreateTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
						request.setType(changelog.getEntity());
						request.setMethod(changelog.getType());
						request.setBody(employee);
						responseWrapper = employeePushService.call(request);
						changelog.setSend(true);
					} else {
						changelog.setMessage("找不到该员工信息");
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
				log.error("员工信息变更远程发布失败", e);
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
			employeeChangeLogService.updateById(changelog);
		}
	}

	private Employee transToEmployee(User user) {
		Employee e = new Employee();
		BeanMapper.copy(user, e);
		e.setName(user.getUsername());
		e.setModifyTime(user.getModTime());
		return e;
	}
}
