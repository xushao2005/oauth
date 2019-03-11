package com.cmhb.module.auth.controller;

import com.cmhb.common.annotation.CurrentUser;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.service.ClientService;
import com.cmhb.module.auth.service.MenuService;
import com.cmhb.module.oauth2.model.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 菜单相关接口
 * Created by luxp on 2017/8/8.
 */
@RestController
@RequestMapping(value = "/controls")
@Slf4j
public class MenuController {
	@Resource
	private MenuService menuService;
	@Resource
	private ClientService clientService;

	/**
	 * 获取当前用户拥有的控件权限
	 *
	 * @param userId
	 * @param clientId
	 * @return
	 */
	@GetMapping("/currentUser/{clientId}")
	public List<ControlModel> currentResources(@CurrentUser Long userId, @PathVariable("clientId") Long clientId) {
		List<ControlModel> defaultControlPerms = menuService.findByUserSessionAndClient(clientId);
		List<ControlModel> settingControlPerms = menuService.findByUserAndClient(userId, clientId);
		Set<ControlModel> controls = new HashSet<>();
		controls.addAll(defaultControlPerms);
		controls.addAll(settingControlPerms);
		return controls.stream().sorted(new ControlModel.Comparator()).collect(Collectors.toList());
	}

	/**
	 * 获取当前部门拥有的控件权限
	 *
	 * @param departmentId
	 * @param clientId
	 * @return
	 */
	@GetMapping("/department-client/{departmentId}/{clientId}")
	public List<ControlModel> departmentClientResources(@PathVariable("departmentId") Long departmentId,
														@PathVariable("clientId") Long clientId) {
		List<Control> controls = menuService.
				findByDepartmentAndClient(departmentId, clientId, ResourceType.ALL);
		return menuService.convertMenu(controls);
	}

	/**
	 * 应用下的所有控件
	 *
	 * @param clientId
	 * @return
	 */
	@GetMapping("/{clientId}")
	public List<ControlModel> currentResources(@PathVariable("clientId") Long clientId) {
		List<Control> controlResource = menuService.findControlByClient(clientId);
		//todo convert调用时机？ 在Control或者Service
		List<ControlModel> controlModels = menuService.convertMenu(controlResource);
		return controlModels;
	}

	/**
	 * 控件权限导入
	 *
	 * @param file json文件
	 * @return
	 */
	@PostMapping(value = "/upload", headers = ("content-type=multipart/*"))
	public Result upload(@RequestParam(value = "file") MultipartFile file) {
		return menuService.loadSourcesFile(file);
	}
}
