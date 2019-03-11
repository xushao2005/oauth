package base;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created by lenovo on 2016/12/4.
 */
@RunWith(value = SpringJUnit4ClassRunner.class)
@ContextConfiguration(
        locations = {
                "classpath*:conf/spring/spring-mybatis.xml",
                "classpath*:conf/spring/spring-config.xml",
        })
public class TestBase {

}
