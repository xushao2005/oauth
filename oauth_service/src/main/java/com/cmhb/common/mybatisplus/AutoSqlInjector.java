package com.cmhb.common.mybatisplus;

import com.baomidou.mybatisplus.entity.TableFieldInfo;
import com.baomidou.mybatisplus.entity.TableInfo;
import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.enums.SqlMethod;
import com.baomidou.mybatisplus.toolkit.StringUtils;
import lombok.val;
import org.apache.ibatis.executor.keygen.Jdbc3KeyGenerator;
import org.apache.ibatis.executor.keygen.KeyGenerator;
import org.apache.ibatis.executor.keygen.NoKeyGenerator;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.scripting.defaults.RawSqlSource;

import java.util.List;

/**
 * Created by not3 on 17.4.15.
 */
public class AutoSqlInjector extends com.baomidou.mybatisplus.mapper.AutoSqlInjector {

	private List<String> autoInsertProperties;

	private List<String> autoUpdateProperties;

	private String deleteFlagField;

	public String getDeleteFlagField() {
		return deleteFlagField;
	}

	public void setDeleteFlagField(String deleteFlagField) {
		this.deleteFlagField = deleteFlagField;
	}

	public List<String> getAutoInsertProperties() {
		return autoInsertProperties;
	}

	public void setAutoInsertProperties(List<String> autoInsertProperties) {
		this.autoInsertProperties = autoInsertProperties;
	}

	public List<String> getAutoUpdateProperties() {
		return autoUpdateProperties;
	}

	public void setAutoUpdateProperties(List<String> autoUpdateProperties) {
		this.autoUpdateProperties = autoUpdateProperties;
	}

	@Override
    protected void injectSelectByIdSql(boolean batch, Class<?> mapperClass, Class<?> modelClass, TableInfo table) {
		SqlMethod sqlMethod = SqlMethod.SELECT_BY_ID;
		SqlSource sqlSource;
		if (batch) {
			sqlMethod = SqlMethod.SELECT_BATCH_BY_IDS;
			StringBuilder ids = new StringBuilder();
			ids.append("\n<foreach item=\"item\" index=\"index\" collection=\"list\" separator=\",\">");
			ids.append("#{item}");
			ids.append("\n</foreach>");
			sqlSource = languageDriver.createSqlSource(configuration, String.format(sqlMethod.getSql(),
					sqlSelectColumns(table, false), table.getTableName(), table.getKeyColumn(), ids.toString()), modelClass);
		} else {
			TableFieldInfo deleteFlagFieldInfo = null;
			if (deleteFlagField != null) {
				for (val fieldInto : table.getFieldList()) {
					if (fieldInto.getProperty().equals(deleteFlagField)) {
						deleteFlagFieldInfo = fieldInto;
						break;
					}
				}
			}
			String selectByIdSqlPattern = null;
			if (deleteFlagFieldInfo == null) {
				selectByIdSqlPattern = sqlMethod.getSql();
			} else {
				selectByIdSqlPattern = new StringBuilder(sqlMethod.getSql()).append(" and ")
						.append(deleteFlagFieldInfo.getColumn()).append("=0").toString();
			}
			sqlSource = new RawSqlSource(configuration, String.format(selectByIdSqlPattern, sqlSelectColumns(table, false),
					table.getTableName(), table.getKeyColumn(), table.getKeyProperty()), Object.class);
		}
		this.addSelectMappedStatement(mapperClass, sqlMethod.getMethod(), sqlSource, modelClass, table);
	}

	@Override
	protected void injectInsertOneSql(boolean selective, Class<?> mapperClass, Class<?> modelClass, TableInfo table) {
		KeyGenerator keyGenerator = new NoKeyGenerator();
		StringBuilder fieldBuilder = new StringBuilder();
		StringBuilder placeholderBuilder = new StringBuilder();
		SqlMethod sqlMethod = selective ? SqlMethod.INSERT_ONE : SqlMethod.INSERT_ONE_ALL_COLUMN;

		fieldBuilder.append("\n<trim prefix=\"(\" suffix=\")\" suffixOverrides=\",\">\n");
		placeholderBuilder.append("\n<trim prefix=\"(\" suffix=\")\" suffixOverrides=\",\">\n");
		String keyProperty = null;
		String keyColumn = null;

		// 表包含主键处理逻辑,如果不包含主键当普通字段处理
		if (StringUtils.isNotEmpty(table.getKeyProperty())) {
			if (table.getIdType() == IdType.AUTO) {
				/* 自增主键 */
				keyGenerator = new Jdbc3KeyGenerator();
				keyProperty = table.getKeyProperty();
				keyColumn = table.getKeyColumn();
			} else {
				/* 用户输入自定义ID */
				fieldBuilder.append(table.getKeyColumn()).append(",");
				if (StringUtils.isNotEmpty(table.getKeyProperty())) {
					// Oracle Sequence
					placeholderBuilder.append(table.getKeyProperty()).append(",");
				} else {
					// 正常自定义主键策略
					placeholderBuilder.append("#{").append(table.getKeyProperty()).append("},");
				}
			}
		}

		List<TableFieldInfo> fieldList = table.getFieldList();

		for (TableFieldInfo fieldInfo : fieldList) {
			if (selective && !autoInsertProperties.contains(fieldInfo.getProperty())) {
				fieldBuilder.append(convertIfTagIgnored(fieldInfo, false));
				fieldBuilder.append(fieldInfo.getColumn()).append(",");
				fieldBuilder.append(convertIfTagIgnored(fieldInfo, true));
				placeholderBuilder.append(convertIfTagIgnored(fieldInfo, false));
				placeholderBuilder.append("#{").append(fieldInfo.getEl()).append("},");
				placeholderBuilder.append(convertIfTagIgnored(fieldInfo, true));
			} else {
				fieldBuilder.append(fieldInfo.getColumn()).append(",");
				placeholderBuilder.append("#{").append(fieldInfo.getEl()).append("},");
			}
		}
		fieldBuilder.append("\n</trim>");
		placeholderBuilder.append("\n</trim>");
		String sql = String.format(sqlMethod.getSql(), table.getTableName(), fieldBuilder.toString(),
				placeholderBuilder.toString());
		SqlSource sqlSource = languageDriver.createSqlSource(configuration, sql, modelClass);
		this.addInsertMappedStatement(mapperClass, modelClass, sqlMethod.getMethod(), sqlSource, keyGenerator,
				keyProperty,
				keyColumn);
	}

	@Override
	protected String sqlSet(boolean selective, TableInfo table, String prefix) {
		StringBuilder set = new StringBuilder();
		set.append("<trim prefix=\"SET\" suffixOverrides=\",\">");
		List<TableFieldInfo> fieldList = table.getFieldList();
		for (TableFieldInfo fieldInfo : fieldList) {
			if (selective && !autoUpdateProperties.contains(fieldInfo.getProperty())) {
				set.append(convertIfTag(true, fieldInfo, prefix, false));
				set.append(fieldInfo.getColumn()).append("=#{");
				if (null != prefix) {
					set.append(prefix);
				}
				set.append(fieldInfo.getEl()).append("},");
				set.append(convertIfTag(true, fieldInfo, null, true));
			} else {
				set.append(fieldInfo.getColumn()).append("=#{");
				if (null != prefix) {
					set.append(prefix);
				}
				set.append(fieldInfo.getEl()).append("},");
			}
		}
		set.append("\n</trim>");
		return set.toString();
	}
}