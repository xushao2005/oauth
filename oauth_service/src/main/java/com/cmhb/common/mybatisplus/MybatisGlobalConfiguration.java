package com.cmhb.common.mybatisplus;

import com.baomidou.mybatisplus.entity.GlobalConfiguration;
import com.baomidou.mybatisplus.mapper.ISqlInjector;

/**
 * Created by not3 on 17.4.15.
 */
public class MybatisGlobalConfiguration extends GlobalConfiguration {
	private ISqlInjector sqlInjector;

	@Override
	public ISqlInjector getSqlInjector() {
		return sqlInjector;
	}

	@Override
	public void setSqlInjector(ISqlInjector sqlInjector) {
		this.sqlInjector = sqlInjector;
	}
}
