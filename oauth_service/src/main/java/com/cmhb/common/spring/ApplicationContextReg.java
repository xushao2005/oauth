/*
package com.cmhb.security.service.impl;

import com.cmhb.common.annotation.ActionDesc;
import com.cmhb.common.annotation.ActionMethodDesc;
import com.cmhb.common.utils.StringHelper;
import com.cmhb.enums.FunctionStatusEnum;
import com.cmhb.enums.FunctionTypeEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class ApplicationContextReg implements ApplicationContextAware ,InitializingBean,Runnable{

	private Logger logger= LoggerFactory.getLogger(ApplicationContextReg.class);
	private ApplicationContext applicationContext;
	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext=applicationContext;

	}


	private void initFunction(){
		RequestMappingHandlerMapping mapping=(RequestMappingHandlerMapping) applicationContext.getBean("handlerMapping");
		Map<RequestMappingInfo, HandlerMethod> map= mapping.getHandlerMethods();
		Set<Entry<RequestMappingInfo, HandlerMethod>> handlers=map.entrySet();
		Iterator<Entry<RequestMappingInfo, HandlerMethod>> it=handlers.iterator();
		FunctionEntity functionEntity=null;
		FunctionEntityDao functionEntityDao=applicationContext.getBean(FunctionEntityDao.class);
		int count=0;
		while(it.hasNext()){
			Entry<RequestMappingInfo, HandlerMethod> entry=it.next();
			RequestMappingInfo mappingInfo=entry.getKey();
			HandlerMethod method=entry.getValue();
			Class class1=method.getMethod().getDeclaringClass();
			Method method2=method.getMethod();
			ActionMethodDesc actionMethodDesc=method2.getAnnotation(ActionMethodDesc.class);
			ActionDesc actionDesc=	(ActionDesc) class1.getAnnotation(ActionDesc.class);
//			logger.info(class1.getName());
//			logger.info(""+mappingInfo.getPatternsCondition().getPatterns());
			Set<String> patterns=mappingInfo.getPatternsCondition().getPatterns();
			String name=method.toString();
			if((null!=patterns)&&(!patterns.isEmpty())){

				Object[] patternStrings= patterns.toArray();
				List<FunctionEntity> functionEntities = functionEntityDao.getFunctionsByUrl(patternStrings[0] + ".htm", functionEntity.getClientId());
				if(patternStrings[0] instanceof String){
					String patternString=(String)patternStrings[0];
					if(!patternString.matches("/.+/.+$")){
						//如果拦截器拦不到则不管
						continue;
					}
				}
				if(null!=functionEntities&&(!functionEntities.isEmpty())){
//					logger.info(patternStrings[0]+".htm is exists!");
					continue;
				}else{
					functionEntity=new FunctionEntity();
					functionEntity.setFunctionname(patternStrings[0]+"");
					functionEntity.setFunctionstatus(FunctionStatusEnum.ACTIVE);
					functionEntity.setFunctiontype(FunctionTypeEnum.DEPARTMENT_PUBLIC);
					functionEntity.setFunctionurl(patternStrings[0]+".htm");
					functionEntity.setDescription(patternStrings[0]+"->"+name);
					functionEntity.setKeyword(name);
					if(null!=actionDesc){
//						logger.info(actionDesc.desc()+actionDesc.code());
						functionEntity.setKeyword(actionDesc.desc());
					}
					if(null!=actionMethodDesc){
//						logger.info(actionMethodDesc.desc()+actionMethodDesc.code());
						functionEntity.setFunctionname(actionMethodDesc.desc());
					}
					functionEntity.setId(StringHelper.getPkid());
					functionEntityDao.insert(functionEntity);
					count++;
				}


			}

		}
		logger.info("total ["+count+"]functions have bean inserted!");
	}


	@Override
	public void afterPropertiesSet() throws Exception {
		Thread thread=new Thread(this);
		thread.start();
	}


	@Override
	public void run() {

		initFunction();
	}
}
*/
