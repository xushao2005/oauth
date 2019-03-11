package com.cmhb.module.employee.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.employee.domain.EmployeeChangeLog;

import java.util.List;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午10:59:28
 */
public interface EmployeeChangeLogDao extends BaseMapper<EmployeeChangeLog>
{
	List<EmployeeChangeLog> selectWhichNeedDistribute();
}
