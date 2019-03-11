package generate;

import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.rules.DbType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class EntityGenerator {
	@Test
	public void generate() {
		/* 获取 JDBC 配置文件 */
		Properties props = getProperties();
		AutoGenerator mpg = new AutoGenerator();

		String outputDir = "generated";

		// 全局配置
		GlobalConfig gc = new GlobalConfig();
		gc.setOutputDir(outputDir);
		gc.setFileOverride(true);
		gc.setActiveRecord(false);// 开启 activeRecord 模式
		gc.setEnableCache(false);// XML 二级缓存
        gc.setBaseResultMap(true);// XML ResultMap
        gc.setBaseColumnList(false);// XML columList

		// 自定义文件命名，注意 %s 会自动填充表实体属性！
		gc.setMapperName("%sDao");
		gc.setXmlName("%sMapper");
		gc.setServiceName("%sService");
		gc.setServiceImplName("%sServiceImpl");
		gc.setControllerName("%sController");
		mpg.setGlobalConfig(gc);

		// 数据源配置
		DataSourceConfig dsc = new DataSourceConfig();
        dsc.setDbType(DbType.MYSQL);
        dsc.setTypeConvert(new MySqlTypeConvert());
        dsc.setDriverName("com.mysql.jdbc.Driver");
        dsc.setUsername(props.getProperty("jdbc.username"));
		dsc.setPassword(props.getProperty("jdbc.password"));
		dsc.setUrl(props.getProperty("jdbc.url"));
		mpg.setDataSource(dsc);

		// 策略配置
		StrategyConfig strategy = new StrategyConfig();
		strategy.setDbColumnUnderline(true);// 全局下划线命名
        strategy.setTablePrefix(new String[]{"auth_"});// 此处可以修改为您的表前缀
        strategy.setInclude(new String[]{"auth_branch"});
        // 字段名生成策略
		strategy.setNaming(NamingStrategy.underline_to_camel);
		strategy.setSuperEntityClass("com.cmhb.domain.BaseEntity");
		mpg.setStrategy(strategy);

		// 包配置
		PackageConfig pc = new PackageConfig();
        pc.setParent("com.cmhb.module"); // 自定义包路径
        pc.setModuleName("auth"); // 所属模块
        pc.setController("controller"); // 这里是控制器包名，默认 web
		pc.setEntity("domain");
		pc.setMapper("dao");
		pc.setXml("sqlMapperXml");
		mpg.setPackageInfo(pc);

		// 注入自定义配置，可以在 VM 中使用 cfg.abc 设置的值
		InjectionConfig cfg = new InjectionConfig() {
			@Override
			public void initMap() {
			}
		};
		List<FileOutConfig> focList = new ArrayList<FileOutConfig>();
		cfg.setFileOutConfigList(focList);
		mpg.setCfg(cfg);

		// 执行生成
		mpg.execute();
	}

	private static Properties getProperties() {
		// 读取配置文件
		Resource resource = new ClassPathResource("conf/env/development/server.properties");
		Properties props = new Properties();
		try {
			props = PropertiesLoaderUtils.loadProperties(resource);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return props;
	}
}
