//todo 重写逻辑
/*
package com.cmhb.common.utils;

import com.alibaba.fastjson.JSONArray;
import com.cmhb.security.web.vo.ZtreeVo;

import java.util.*;
import java.util.Map.Entry;

public class ZtreeUtils {

	public static JSONArray toZtreeList(List<FunctionEntity> functionEntities,
                                        List<FunctionEntity> exists) {
		Map<String, FunctionEntity> existMap = new HashMap<String, FunctionEntity>();
		for (FunctionEntity entity : exists) {
			existMap.put(entity.getId(), entity);
		}
		//按keyword分组
		Map<String, List<FunctionEntity>> map=new TreeMap<String, List<FunctionEntity>>();
		for(FunctionEntity functionEntity:functionEntities) {
			if(map.containsKey(functionEntity.getKeyword())) {
				List<FunctionEntity> temp=map.get(functionEntity.getKeyword());
				temp.add(functionEntity);
			}else{
				List<FunctionEntity> temp=new ArrayList<FunctionEntity>();
				temp.add(functionEntity);
				map.put(functionEntity.getKeyword(), temp);
			}
		}
		JSONArray jsonArray = new JSONArray();
		ZtreeVo ztreeVo0 = new ZtreeVo();
		ztreeVo0.setId("-1");
		ztreeVo0.setPId("0");
		ztreeVo0.setName("所有权限");
		ztreeVo0.setOpen(true);
        ztreeVo0.setParent(true);
        jsonArray.add(ztreeVo0);
		int i=0;
		int j=1000;
		for(Entry<String, List<FunctionEntity>> entry:map.entrySet()){
			ZtreeVo ztreeVo = new ZtreeVo();
			ztreeVo.setId(String.valueOf(j));
			ztreeVo.setPId("-1");
			ztreeVo.setName(entry.getKey());
			ztreeVo.setOpen(false);

			int v=0;
			if(null!=entry.getValue()&&entry.getValue().size()>1){
				for (FunctionEntity entity : entry.getValue()) {
					ZtreeVo ztreeVoIn = new ZtreeVo();
					ztreeVoIn.setId(entity.getId());
					ztreeVoIn.setPId(String.valueOf(j));
					ztreeVoIn.setName(entity.getFunctionname());
					ztreeVoIn.setOpen(true);
					if (existMap.containsKey(entity.getId())) {
						ztreeVoIn.setChecked(true);
						v++;
					}
					jsonArray.add(ztreeVoIn);
					//叶子父节点设置clientId 隐藏指定client子树
					if (ztreeVo0.getClient() != null) {
						ztreeVo0.setClient(entity.getClientId());
					}
				}
				if (v> 0) {
					ztreeVo.setChecked(true);
					i++;
				}
				ztreeVo.setClient(entry.getValue().get(0).getClientId());
				jsonArray.add(ztreeVo);

			}else{
				for (FunctionEntity entity : entry.getValue()) {
					ZtreeVo ztreeVoIn = new ZtreeVo();
					ztreeVoIn.setId(entity.getId());
					ztreeVoIn.setPId("-1");
					ztreeVoIn.setName(entity.getFunctionname());
					ztreeVoIn.setOpen(true);
					if (existMap.containsKey(entity.getId())) {
						ztreeVoIn.setChecked(true);
						i++;
					}
					jsonArray.add(ztreeVoIn);
				}
			}

            //资源数打到一定数量会重复ZtreeVo.id和ZtreeVo.pid会重复
            j--;
		}
		ztreeVo0 = (ZtreeVo) jsonArray.get(0);
		if (i > 0) {
			ztreeVo0.setChecked(true);
		}
		Collections.reverse(jsonArray);//倒序排列
		return jsonArray;
	}

	public static JSONArray toZtreeListRole(List<RoleEntity> roleEntities,
                                            List<RoleEntity> exists) {
		Map<String, RoleEntity> existMap = new HashMap<String, RoleEntity>();
		for (RoleEntity entity : exists) {
			existMap.put(entity.getId(), entity);
		}
		JSONArray jsonArray = new JSONArray();
		ZtreeVo ztreeVo0 = new ZtreeVo();
		ztreeVo0.setId("-1");
		ztreeVo0.setPId("0");
		ztreeVo0.setIcon("/plug/zTree_v3-master/css/zTreeStyle/img/diy/1_open.png");
		ztreeVo0.setName("所有角色");
		ztreeVo0.setOpen(true);
		jsonArray.add(ztreeVo0);
		int i = 0;
		for (RoleEntity entity : roleEntities) {
			ZtreeVo ztreeVo = new ZtreeVo();
			ztreeVo.setId(entity.getId());
			ztreeVo.setPId("-1");
			ztreeVo.setName(entity.getRolename());
			ztreeVo.setOpen(true);
			ztreeVo.setIcon("/plug/zTree_v3-master/css/zTreeStyle/img/diy/3.png");
			if (existMap.containsKey(entity.getId())) {
				ztreeVo.setChecked(true);
				i++;
			}
			jsonArray.add(ztreeVo);
		}
		ztreeVo0 = (ZtreeVo) jsonArray.get(0);
		if (i > 0) {
			ztreeVo0.setChecked(true);
		}
		return jsonArray;
	}
}
*/
