package com.cmhb.module.employee.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.employee.domain.EmployeeChangeLog;
import com.cmhb.module.employee.dao.EmployeeChangeLogDao;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午11:01:29
 */
@Service
public class EmployeeChangeLogService extends ServiceImpl<EmployeeChangeLogDao, EmployeeChangeLog>
{
	@Resource
	private EmployeeChangeLogDao employeeChangeLogDao;
	public List<EmployeeChangeLog> selectWhichNeedDistribute() {
		return employeeChangeLogDao.selectWhichNeedDistribute();
	}

}
