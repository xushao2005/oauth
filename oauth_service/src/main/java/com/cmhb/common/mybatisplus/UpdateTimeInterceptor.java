package com.cmhb.common.mybatisplus;

import com.baomidou.mybatisplus.toolkit.PluginUtils;
import lombok.val;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.reflection.SystemMetaObject;

import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * Created by not3 on 17.4.15.
 */
@Intercepts({ @Signature(type = StatementHandler.class, method = "prepare", args = { Connection.class, Integer.class }) })
public class UpdateTimeInterceptor implements Interceptor {
	private static final List<String> NO_SETTER_CACHE = new ArrayList<>();

	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		val target = invocation.getTarget();
		if (target instanceof StatementHandler) {
			val statementHandler = (StatementHandler) PluginUtils.realTarget(invocation.getTarget());
			val metaStatementHandler = SystemMetaObject.forObject(statementHandler);
			val mappedStatement = (MappedStatement) metaStatementHandler.getValue("delegate.mappedStatement");
			val sqlCommandType = mappedStatement.getSqlCommandType();
			if (SqlCommandType.UPDATE.equals(sqlCommandType)) {
				val boundSql = (BoundSql) metaStatementHandler.getValue("delegate.boundSql");
				val now = LocalDateTime.now();
				setIfHasProperty(boundSql, "_parameter.et.", "modTime", now);
				setIfHasProperty(boundSql, "_parameter.et.", "modifyTime", now);
			}
		}
		return invocation.proceed();
	}

	private void setIfHasProperty(BoundSql boundSql, String prefix, String property, Object value) {
		Object parameterObject = boundSql.getParameterObject();
		String keyClazz = null;
		if (parameterObject instanceof Map) {
			val map = (Map) parameterObject;
			val object = map.get("et");
			if (object != null) {
				keyClazz = object.getClass().getName();
			} else {
			}
		} else {
			keyClazz = parameterObject.getClass().getName();
		}
		String propertyWithPrefix = null;
		String key = null;
		if (keyClazz == null) {
			key = property;
			propertyWithPrefix = property;
		} else {
			key = new StringBuilder(keyClazz).append(".").append(property).toString();
			propertyWithPrefix = prefix + property;
		}
		if (keyClazz ==null || !NO_SETTER_CACHE.contains(key)) {
			val oldValue = boundSql.getAdditionalParameter(property);
			if (oldValue == null) {
				try {
					if (parameterObject instanceof Map) {
						boundSql.setAdditionalParameter(propertyWithPrefix, value);
					} else {
						boundSql.setAdditionalParameter(property, value);
					}
				} catch (Exception e) {
					NO_SETTER_CACHE.add(key);
				}
			}
		}
	}

	@Override
	public Object plugin(Object target) {
		if (target instanceof StatementHandler) {
			return Plugin.wrap(target, this);
		}
		return target;
	}

	@Override
	public void setProperties(Properties properties) {
	}
}
