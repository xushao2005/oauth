package com.cmhb.module.oauth2.controller;

import com.alibaba.fastjson.JSONObject;
import com.cmhb.common.annotation.CurrentUser;
import com.cmhb.common.annotation.TokenClient;
import com.cmhb.common.exceptions.OAuthException;
import com.cmhb.common.shiro.ShiroUser;
import com.cmhb.common.utils.WebUtils;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.service.ClientService;
import com.cmhb.module.auth.service.MenuService;
import com.cmhb.module.auth.service.UserService;
import com.cmhb.module.oauth2.OAuthAuthxRequest;
import com.cmhb.module.oauth2.authorize.CodeAuthorizeHandler;
import com.cmhb.module.oauth2.authorize.RevokeAuthHandler;
import com.cmhb.module.oauth2.model.Result;
import lombok.extern.slf4j.Slf4j;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.SessionException;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@Slf4j
public class AuthorizeController {
	private final static Logger LOGGER = LoggerFactory.getLogger(AuthorizeController.class);
	public static final String OAuth2URL = "http://127.0.0.1:8333/#/oauth2/authorize";

	@Resource
	private UserService userService;
	@Resource
	private MenuService menuService;
	@Resource
	private ClientService clientService;

	/**
	 * Must handle the grant_type as follow:
	 * grant_type="authorization_code" -> response_type="code"
	 * ?response_type=code&scope=read,write&client_id=[client_id]&redirect_uri=[redirect_uri]&state=[state]
	 * <p/>
	 * grant_type="implicit"   -> response_type="token"
	 * ?response_type=token&scope=read,write&client_id=[client_id]&client_secret=[client_secret]&redirect_uri=[redirect_uri]
	 * <p/>
	 *
	 * @param request  HttpServletRequest
	 * @param response HttpServletResponse
	 */
	@Deprecated
	@RequestMapping("authorize")
	public void authorize(HttpServletRequest request, HttpServletResponse response) throws OAuthSystemException, ServletException, IOException, OAuthException {
		try {
			OAuthAuthxRequest oauthRequest = new OAuthAuthxRequest(request);
			CodeAuthorizeHandler codeAuthorizeHandler = new CodeAuthorizeHandler(oauthRequest, response);
			codeAuthorizeHandler.handle();
		} catch (OAuthProblemException e) {
			LOGGER.error("accessToken exception", e);

			String redirectUri = e.getRedirectUri();
			if (OAuthUtils.isEmpty(redirectUri)) {
				//告诉客户端没有传入redirectUri直接报错
				OAuthResponse oAuthResponse = OAuthResponse.errorResponse(HttpServletResponse.SC_UNAUTHORIZED)
//                        .error(e)
						.setError(OAuthError.CodeResponse.INVALID_REQUEST)
						.setErrorDescription(e.getMessage())
						.buildJSONMessage();
				WebUtils.writeOAuthJsonResponse(response, oAuthResponse);
			}

			//返回错误消息（如?error=）
			OAuthResponse oAuthResponse =
					OAuthASResponse.errorResponse(HttpServletResponse.SC_UNAUTHORIZED)
//                            .location(redirectUri)
//                            .error(e)
							.setError(OAuthError.CodeResponse.INVALID_REQUEST)
							.setErrorDescription(e.getMessage())
							.buildJSONMessage();
			WebUtils.writeOAuthJsonResponse(response, oAuthResponse);
		}

	}

	/**
	 * 登出接口 从应用调用
	 *
	 * @param accessToken
	 * @param response
	 * @throws OAuthSystemException
	 * @throws IOException
	 * @throws ServletException
	 */
	@Deprecated
//    @RequestMapping(path = "/revokeoauth2", method = RequestMethod.POST)
	public void revokeOAuth2(@RequestParam(value = "access_token") String accessToken, HttpServletResponse response) throws OAuthSystemException, IOException, ServletException {
		RevokeAuthHandler revokeAuthHandler = new RevokeAuthHandler(response);
		revokeAuthHandler.handle(accessToken);
	}

	@PostMapping("/login")
	public ResponseEntity login() {
		Subject subject = SecurityUtils.getSubject();
		if (subject.isAuthenticated()) {
			return new ResponseEntity(HttpStatus.OK);
		}
		return new ResponseEntity(HttpStatus.UNAUTHORIZED);
	}

	/**
	 * 业务系统登出认证中心
	 *
	 * @return
	 */
	@PostMapping("/revokeoauth2")
	@ResponseBody
	public ResponseEntity logout() {
		Result result = new Result();
		//todo 使用token获取subject 当前流程cookie->session->subject
		Subject subject = SecurityUtils.getSubject();

		try {
			subject.logout();
		} catch (SessionException ise) {
			log.debug("Encountered session exception during logout.  This can generally safely be ignored.", ise);
			result.setSuccessful(false);
			result.setMsg("logout fail");
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		result.setSuccessful(true);
		result.setMsg("logout success...");
		log.info("revoke oauth2...");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	/**
	 * 根据用户ID获取用户信息
	 *
	 * @param shiroUser
	 * @return 成功   {successful:true, result:{xxx: aaa}}
	 * 失败   {successful:false, msg: ""}
	 */
	@GetMapping(path = "/userInfo")
	@ResponseBody
	public Result getUserInfo(@CurrentUser ShiroUser shiroUser) {
		Result response = new Result();

		User userEntity = userService.findUser(shiroUser.getId());
		if (userEntity == null) {
			response.setSuccessful(false);
			response.setMsg("用户不存在");
			return response;
		}

		JSONObject user = new JSONObject();
		user.put("userId", userEntity.getId());
		user.put("loginName", userEntity.getLoginName());
		user.put("username", userEntity.getUsername());
		user.put("sales", userEntity.getSales());
		user.put("checking", userEntity.getChecking());
		user.put("receipt", userEntity.getReceipt());
		user.put("dataAdmin", userEntity.getDataAdmin());
		response.setSuccessful(true);
		response.setResult(user);
		return response;
	}

	/**
	 * 获取所有菜单权限
	 *
	 * @return
	 */
	@GetMapping("/all/menuPerms")
	@ResponseBody
	public Result getAllMenusPerms(@RequestParam("appId") String appId) {
		Result result = new Result();
		Client client = clientService.findByAppId(appId);

		if (client == null) {
			result.setSuccessful(false);
			result.setMsg("appId错误");
			return result;
		}

		List<Control> controls = menuService.findControlByClient(client.getId());
		List<ControlModel> contentModels = menuService.convertMenu(controls);
		result.setSuccessful(true);
		result.setResult(contentModels);
		return result;
	}

	/**
	 * 获取用户的菜单权限
	 *
	 * @return
	 */
	@GetMapping("/user/menuPerms")
	@ResponseBody
	public Result getUserMenusPerms(@CurrentUser Long uid, @TokenClient Long clientId) {
		Result result = new Result();
		List<ControlModel> defaultControlPerms = menuService.findByUserSessionAndClient(clientId);
		List<ControlModel> settingControlPerms = menuService.findByUserAndClient(uid, clientId);
		Set<ControlModel> controls = new HashSet<>();
		controls.addAll(defaultControlPerms);
		controls.addAll(settingControlPerms);
		result.setSuccessful(true);
		result.setResult(controls.stream().sorted(new ControlModel.Comparator()).collect(Collectors.toList()));
		return result;
	}

	/**
	 * 获取所有api权限9
	 *
	 * @return
	 */
	@GetMapping("/all/apiPerms")
	@ResponseBody
	public Result getAllApiPerms(@RequestParam("appId") String appId) {
		//todo 对外接口 获取应用的所有api资源
		Result result = new Result();
		return result;
	}

	/**
	 * 获取用户的api权限
	 *
	 * @return
	 */
	@GetMapping("/user/apiPerms")
	@ResponseBody
	public Result getUserApiPerms(@CurrentUser Long uid, @TokenClient Long clientId) {
		//todo 对外接口 获取应用下用户的api权限
		Result result = new Result();
		return result;
	}
}