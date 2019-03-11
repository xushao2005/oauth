package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.common.exceptions.ServiceException;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.common.utils.JsonUtils;
import com.cmhb.domain.BaseEntity;
import com.cmhb.module.auth.dao.MenuDao;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.domain.Duty;
import com.cmhb.module.auth.domain.Role;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.model.ControlNode;
import com.cmhb.module.auth.model.ControlRoot;
import com.cmhb.module.oauth2.model.Result;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * 从资源中获取菜单
 * Created by luxp on 2017/8/8.
 */
@Service
@Slf4j
public class MenuService extends ServiceImpl<MenuDao, Control> {
	@Resource
	private RoleService roleService;
	@Resource
	private DutyService dutyService;
	@Resource
	private MenuDao menuDao;
	@Resource
	private RRoleMenuService rRoleMenuService;
	@Resource
	private ClientService clientService;

	public List<ControlModel> findByUserSessionAndClient(@NonNull Long clientId) {
		val param = new EntityWrapper<Control>();
		param.eq("filter", "user");
		param.eq("client_id", clientId);
		List<Control> list = selectList(param);
		return list.stream().map(this::convert).collect(Collectors.toList());
	}

	/**
	 * 获取用户在指定应用上拥有的控件权限
	 *
	 * @param userId
	 * @param clientId
	 * @return
	 */
	public List<ControlModel> findByUserAndClient(Long userId, Long clientId) {
		if (userId == null || clientId == null) {
			log.error("NPE: userId={}, clientId={}", userId, clientId);
			throw new IllegalArgumentException("参数错误");
		}

		return getControlPerms(userId, clientId, ResourceType.ALL);
	}

	/**
	 * 指定客户端所有控件（菜单、按钮）权限
	 *
	 * @param clientId
	 * @return
	 */
	public List<Control> findControlByClient(Long clientId) {
		Wrapper<Control> params = new EntityWrapper<>();
		params.eq("client_id", clientId);
		params.eq("status", 1);
		return selectList(params);
	}

	private static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
		Map<Object, Boolean> seen = new ConcurrentHashMap<>();
		return object -> seen.putIfAbsent(keyExtractor.apply(object), Boolean.TRUE) == null;
	}

	public boolean loadSourcesFile(MultipartFile file, Long clientId) throws IOException {
		String fileName = file.getOriginalFilename();
		log.info("开始导入文件[{}]...", fileName);
		String json = IOUtils.toString(file.getInputStream(), StandardCharsets.UTF_8.name());

		List<ControlNode> list;
		try {
			list = JsonUtils.parseList(json, ControlNode.class);
		} catch (Exception e) {
			log.error(e.getMessage());
			return false;
		}

		//转换到Bean
		List<Control> controls = list.stream()
				.map(this::dfsControlNode)
				.flatMap(Collection::stream)
				.filter(this::validateControl)
				.map(menuModel -> new Control.ControlBuilder(menuModel)
						.clientId(clientId).status(BaseEntity.EXISTENT).build())
				.collect(Collectors.toList());
		//todo 若当前有多个角色，授予哪个角色？
		//导入的权限默认授予admin
		//导入相同的权限执行更新
		insertOrUpdateBatch(controls);
//        //授权给管理员 管理员id=1
		rRoleMenuService.grantRolePerm(controls.stream()
				.map(BaseEntity::getId)
				.collect(Collectors.toList()), clientId, 1L);
		log.info("文件[{}]导入结束...", fileName);
		return true;
	}

	public Result loadSourcesFile(MultipartFile file) {
		Result ret = new Result();
		ret.setSuccessful(false);

		String fileName = file.getOriginalFilename();
		log.info("开始导入文件[{}]...", fileName);

		try {
			String json = IOUtils.toString(file.getInputStream(), StandardCharsets.UTF_8.name());
			ControlRoot root = JsonUtils.parse(json, ControlRoot.class);
			String appId = root.getAppId();
			List<ControlNode> list = root.getMenus();

			if (appId == null) {
				ret.setMsg("appId不能为空");
				return ret;
			}
			if (list == null || list.isEmpty()) {
				ret.setMsg("menus不能为空");
				return ret;
			}
			val client = clientService.findByAppId(appId);
			if (client == null) {
				ret.setMsg(appId + "对应的client不存在");
				return ret;
			}

			Long clientId = client.getId();
			//转换到Bean
			List<Control> controls = list.stream()
					.map(this::dfsControlNode)
					.flatMap(Collection::stream)
					.filter(this::validateControl)
					.map(menuModel -> new Control.ControlBuilder(menuModel)
							.clientId(clientId).status(BaseEntity.EXISTENT).build())
					.collect(Collectors.toList());
			//todo 若当前有多个角色，授予哪个角色？
			//导入的权限默认授予admin
			//导入相同的权限执行更新
			insertOrUpdateBatch(controls);
//        //授权给管理员 管理员id=1
			rRoleMenuService.grantRolePerm(controls.stream()
					.map(BaseEntity::getId)
					.collect(Collectors.toList()), clientId, 1L);
		} catch (Exception e) {
			log.error("文件[{}]导入异常:", fileName, e);
			ret.setMsg("文件上传异常");
			return ret;
		}

		log.info("文件[{}]导入结束...", fileName);

		ret.setSuccessful(true);
		ret.setMsg("文件上传成功");
		return ret;
	}

	/**
	 * 树形结构->扁平化
	 *
	 * @param root
	 * @return
	 */
	private List<ControlNode> dfsControlNode(ControlNode root) {
		List<ControlNode> controlNodes = new ArrayList<>();
		Stack<ControlNode> stack = new Stack<>();
		stack.push(root);
		while (!stack.isEmpty()) {
			ControlNode node = stack.pop();
			if (node == null) {
				continue;
			}

			List<ControlNode> children = node.getChildren();
			if (children != null) {
				for (ControlNode child : children) {
					child.setBreadPId(node.getId());
					if (child.getControlPId() == 0) {
						child.setControlPId(node.getId());
					}
					stack.push(child);
				}
			}
			controlNodes.add(node);
		}
		return controlNodes;
	}

	/**
	 * 根据主键更新
	 *
	 * @param control
	 * @return
	 */
	public boolean updateByPK(Control control) {
		if (control == null ||
				control.getId() == null ||
				control.getClientId() == 0) {
			String errorMsg = String.format("数据不完整。%s", control);
			throw new IllegalArgumentException(errorMsg);
		}
		return retBool(menuDao.updateByPrimaryKeySelective(control));
	}

	@Override
	public boolean insertOrUpdate(Control entity) {
		if (entity == null ||
				entity.getId() == null ||
				entity.getClientId() == 0) {
			String errorMsg = String.format("数据不完整。%s", entity);
			throw new IllegalArgumentException(errorMsg);
		}
		return updateByPK(entity) || insert(entity);

	}

	/**
	 * 查询控件
	 *
	 * @param roleId       角色
	 * @param clientId     应用
	 * @param resourceType 控件类型
	 * @return
	 */
	public List<Control> findByRoleAndClient(Long roleId, Long clientId, ResourceType resourceType) {
		if (resourceType == null) {
			throw new IllegalArgumentException("resourceType不是能为空");
		}

		List<Control> controls;
		if (resourceType.equals(ResourceType.ALL)) {
			controls = menuDao.selectByRoleAndClient(roleId, clientId);
		} else {
			controls = menuDao.selectByRoleClientType(roleId, clientId, resourceType.name());
		}
		return controls == null ? new ArrayList<>() : controls;
	}

	/**
	 * 查询控件
	 *
	 * @param departmentId 部门
	 * @param clientId     应用
	 * @param resourceType 控件类型
	 * @return
	 */
	public List<Control> findByDepartmentAndClient(Long departmentId, Long clientId, ResourceType resourceType) {
		if (resourceType == null) {
			throw new IllegalArgumentException("resourceType不是能为空");
		}

		List<Control> controls;
		if (resourceType.equals(ResourceType.ALL)) {
			controls = menuDao.selectByDepartmentAndClient(departmentId, clientId);
		} else {
			controls = menuDao.selectByDepartmentClientType(departmentId, clientId, resourceType.name());
		}
		return controls == null ? new ArrayList<>() : controls;
	}

	/**
	 * 查询控件
	 *
	 * @param dutyId       岗位职责
	 * @param clientId     应用
	 * @param resourceType 控件类型
	 * @return
	 */
	public List<Control> findByDutyAndClient(Long dutyId, Long clientId, ResourceType resourceType) {
		if (resourceType == null) {
			throw new IllegalArgumentException("resourceType不是能为空");
		}

		List<Control> controls;
		if (resourceType.equals(ResourceType.ALL)) {
			controls = menuDao.selectByDutyAndClient(dutyId, clientId);
		} else {
			controls = menuDao.selectByDutyClientType(dutyId, clientId, resourceType.name());
		}
		return controls == null ? new ArrayList<>() : controls;
	}


	private List<ControlModel> getControlPerms(long userId, long clientId, ResourceType resourceType) {
		List<Role> roles = roleService.findRoleByUser(userId);
		List<Duty> duties = dutyService.findByUser(userId);
		List<ControlModel> allControls = new ArrayList<>();
		List<ControlModel> roleControls = roles.stream()
				.map(role -> findByRoleAndClient(role.getId(), clientId, resourceType))
				.flatMap(Collection::stream)
				.filter(distinctByKey(Control::getId))
				.map(this::convert)
				.collect(Collectors.toList());

		List<ControlModel> dutyControls = duties.stream()
				.map(duty -> findByDutyAndClient(duty.getId(), clientId, resourceType))
				.flatMap(Collection::stream)
				.filter(distinctByKey(Control::getId))
				.map(this::convert)
				.collect(Collectors.toList());
		allControls.addAll(roleControls);
		allControls.addAll(dutyControls);
		return allControls;
	}

	/**
	 * 检验控件数据
	 *
	 * @param controlNode
	 * @return
	 */
	public boolean validateControl(ControlNode controlNode) {
		String resourceType = controlNode.getType();
		Long id = controlNode.getId();
		String name = controlNode.getName();

		if (id == 0 ||
				StringUtils.isBlank(resourceType) ||
				StringUtils.isBlank(name)) {
			log.error("id={},type={},name={}", id, resourceType, name);
			throw new ServiceException("json数据错误");
		}
		//region 菜单类型 todo 验证完整性
            /*if (StringUtils.equalsIgnoreCase(ResourceType.MENU.name(), resourceType)) {
                if (StringUtils.isBlank(menuModel.getRouter())) {
                    throw new ServiceException("[id: " +
                            id + ",name: " +
                            name + "]缺失router字段");
                }
            }*/
		//endregion
		//region 按钮类型 todo 验证完整性
            /*if (StringUtils.equalsIgnoreCase(ResourceType.BUTTON.name(), resourceType)) {
            }*/
		//endregion
		//region api类型 todo 验证完整性
            /*if (StringUtils.equalsIgnoreCase(ResourceType.API.name(), resourceType)) {
                if (StringUtils.isBlank(menuModel.getPath())) {
                    log.error("");
                    throw new ServiceException("[id: " +
                            id + ",name: " +
                            name + "]缺失path字段");
                }
                //api父节点没有请求方法类型，子节点必须有请求方法类型
                if (menuModel.getParentId() == null ^
                        StringUtils.isNotBlank(menuModel.getMethodType())) {
                    throw new ServiceException("[id: " +
                            id + ",name: " +
                            name + "] ");
                }
                menuModel.setMethodType(StringUtils.upperCase(menuModel.getMethodType()));
            }*/
		//endregion

		return true;
	}

	public List<ControlModel> convertMenu(Collection<Control> controls) {
		return controls.stream()
				.map(this::convert)
				.collect(Collectors.toList());
	}

	private ControlModel convert(Control control) {
		ControlModel controlModel = BeanMapper.map(control, ControlModel.class);

		if (ResourceType.BUTTON.name().equals(control.getType())) {
			controlModel.setControlPId(-1L);
		}
		return controlModel;
	}
}