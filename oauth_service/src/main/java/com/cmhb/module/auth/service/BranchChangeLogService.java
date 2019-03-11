package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.BranchChangeLogDao;
import com.cmhb.module.auth.domain.BranchChangeLog;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * （一句话功能简述）
 * <br>（功能详细描述）
 * @author 刘旭
 * @version V1.0
 * @see [相关类/方法]
 * @since 2017年6月26日 下午8:51:02
 */
@Service
public class BranchChangeLogService extends ServiceImpl<BranchChangeLogDao, BranchChangeLog>
{
	@Resource
	private BranchChangeLogDao branchChangeLogDao;

	public List<BranchChangeLog> selectWhichNeedDistribute() {
		return branchChangeLogDao.selectWhichNeedDistribute();
	}

}
