package com.cmhb.common.shiro.filter;

import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.service.MenuService;
import lombok.Getter;
import lombok.Setter;
import lombok.val;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.List;

public class SpringRestShiroFilterFactoryBean extends ShiroFilterFactoryBean implements InitializingBean {
    @Resource
    private MenuService menuService;
    @Getter
    @Setter
    private String detaultfilterChainDefinition = "user";
    @Getter
    @Setter
    private List<String> annoymousResources;

    @Override
    public void afterPropertiesSet() throws Exception {
        //todo 认证中心权限资源
        List<Control> resources = menuService.findControlByClient(0L);
        val filterChainDefinitionMap = getFilterChainDefinitionMap();
        for (Control resource : resources) {
            //todo 获取path
            String pattern = resource.getRouter();
            if (StringUtils.hasText(pattern)) {
//                filterChainDefinitionMap.put(pattern, buildRestResource(pattern));
            }
        }

        // 配置匿名资源访问filter规则
        if (annoymousResources == null || annoymousResources.isEmpty()) {
        } else {
            for (val resource : annoymousResources) {
                if (StringUtils.hasText(resource)) {
                    filterChainDefinitionMap.put(resource, "anon");
                }
            }
        }

        // 阻止用户访问系统未配置权限的页面
        filterChainDefinitionMap.put("/login", "authc");
        filterChainDefinitionMap.put("/logout", "logout");
        filterChainDefinitionMap.put("/**", detaultfilterChainDefinition);
    }

    // TODO some resources need write protect permission
    private String buildRestResource(String pattern) {
        return new StringBuilder("user,perms[").append(pattern).append("]").toString();
    }
}
