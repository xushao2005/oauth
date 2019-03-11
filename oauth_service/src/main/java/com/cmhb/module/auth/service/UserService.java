package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.common.exceptions.ServiceException;
import com.cmhb.common.shiro.cache.ShiroCacheHelper;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.common.utils.PasswordHelper;
import com.cmhb.module.auth.dao.UserDao;
import com.cmhb.module.auth.domain.Branch;
import com.cmhb.module.auth.domain.Department;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.model.UserModel;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
@Service
@Slf4j
public class UserService extends ServiceImpl<UserDao, User> {
    @Resource
    private UserDao userDao;
    
    @Resource
	private BranchService branchService;

    @Resource
    private DepartmentService departmentService;

    private static final Pattern DIGITAL = Pattern.compile("\\d+");

    public User getByLoginName(String loginName) {
        if (StringUtils.isBlank(loginName)) {
            throw new RuntimeException("缺失登录名");
        }
        val userParam = new User();
        userParam.setLoginName(loginName);
        Wrapper<User> wrapper = new EntityWrapper<>(userParam);
        return selectOne(wrapper);
    }

    /**
     * 分页查询
     *
     * @param page
     * @param userModel
     *
     * @return
     */
    public List findPage(Page<User> page, UserModel userModel) {
        Map<String, Object> params = queryParams(userModel);
        List<User> users = userDao.selectPage(params, page);

        this.showList(users);

        page.setRecords(users);
        return users;
    }
    

	private void showList(List<User> users)
	{
		if (users == null || users.isEmpty())
		{
			return;
		}

		List<Branch> branches = branchService.selectByMap(null);
        Map<String, String> branchMap = new HashMap(64);
		if (branches != null && !branches.isEmpty())
		{
			for (Branch branch : branches)
			{
                branchMap.put(branch.getCode(), branch.getName());
			}
		}

        List<Department> departments = departmentService.selectByMap(null);
        Map<Long, String> departmentMap = new HashMap(8);
        if (departments != null && !departments.isEmpty())
        {
            for (Department department : departments)
            {
                departmentMap.put(department.getId(), department.getName());
            }
        }

        for (User user : users)
        {
            user.setBranchCompanyName(branchMap.get(user.getBranchCompany()));
            user.setDepartmentName(departmentMap.get(user.getDepartmentId()));
        }
	}

    public Map<String, Object> queryParams(UserModel userModel) {
        Map<String, Object> params = new HashMap<>();
        if (userModel == null) {
            return params;
        }
        if (userModel.getId() != null) {
            params.put("id", userModel.getId());
        }
        if (StringUtils.isNotBlank(userModel.getLoginName())) {
            params.put("loginName", userModel.getLoginName());
        }
		if (StringUtils.isNotBlank(userModel.getUsername()))
		{
			params.put("username", userModel.getUsername());
		}
        if (StringUtils.isNotBlank(userModel.getBranchCompany())) {
            params.put("branchCompany", userModel.getBranchCompany());
        }
        if (null != userModel.getDepartmentId()) {
            params.put("departmentId", userModel.getDepartmentId());
        }
        if (null != userModel.getPositionId()) {
            params.put("positionId", userModel.getPositionId());
        }
        if (null != userModel.getDutyId()) {
            params.put("dutyId", userModel.getDutyId());
        }
		params.put("sales", this.isTrue(userModel.getSales()));
		params.put("checking", this.isTrue(userModel.getChecking()));
		params.put("receipt", this.isTrue(userModel.getReceipt()));
		params.put("driver", this.isTrue(userModel.getDriver()));
		params.put("dutyStatus", this.isTrue(userModel.getDutyStatus()));
        return params;
    }
    
	private String isTrue(Boolean flag)
	{
		if (flag == null)
		{
			return null;
		}
		if (flag)
		{
			return "1";
		}
		else
		{
			return "0";
		}
	}


    public User findUser(Long userId) {
        User user = super.selectById(userId);
        if (user == null) {
            throw new ServiceException("用户不存在");
        }
        return user;
    }

    public void update(UserModel userModel) {
        userModel.setDutyStatus(true);
        User user = BeanMapper.map(userModel, User.class);
        //todo 数据验证
        updateById(user);
        if (null ==user.getPositionId()) {
            userDao.doUpdateUser(user);
        }

    }

    public void create(UserModel userModel) {
        User user = BeanMapper.map(userModel, User.class);
        user.setStatus(1);
        user.setEntryTime(LocalDateTime.now());
        user.setDutyStatus(true);
        //设置默认登录账号/密码
        //user.setLoginName(String.valueOf(user.getId()));
        user.setPassword("a222222");
        PasswordHelper.encryptPassword(user);
        insert(user);
    }

    public boolean delete(Long id) {
        User user = super.selectById(id);
        if (user == null) {
            return false;
        }
        if (user.getStatus().equals(0)) {
            return true;
        } else {
            user.setStatus(0);
            user.setEntryTime(LocalDateTime.now());
            return super.updateById(user);
        }
    }

    /**
     * 修改密码
     *
     * @param userModel
     */
    public boolean changePasswd(UserModel userModel) {
        if (userModel.getId() == null) {
            throw new RuntimeException("参数错误");
        }
        if (!isPasswdValid(userModel.getPassword(), userModel.getConfirmPasswd())) {
            throw new RuntimeException("密码不一致");
        }

        User user = BeanMapper.map(userModel, User.class);
        PasswordHelper.encryptPassword(user);
        boolean successful = retBool(userDao.changePasswd(user));
        if (successful) {
            // 清除认证缓存
            Subject subject = SecurityUtils.getSubject();
            ShiroCacheHelper.clearCachedAuthenticationInfo(subject.getPrincipals());
        }
        return successful;
    }

    /**
     * 管理员修改用户登录信息
     *
     * @param userModel
     */
    public void changeAuthInfo(UserModel userModel) {
        if (userModel.getId() == null) {
            throw new RuntimeException("参数错误");
        }
        if (!isPasswdValid(userModel.getPassword(), userModel.getConfirmPasswd())) {
            throw new RuntimeException("密码不一致");
        }
        if (!isLoginNameUnique(userModel.getId(), userModel.getLoginName())) {
            throw new RuntimeException("登录名重复");
        }

        User user = BeanMapper.map(userModel, User.class);
        PasswordHelper.encryptPassword(user);
        userDao.changeAuthInfo(user);
        // 清除认证缓存
        ShiroCacheHelper.clearCachedAuthenticationInfo(user.getLoginName());
    }

    public boolean isUserValid(UserModel userModel) {
        if (userModel == null) {
            return false;
        }
        if (StringUtils.isBlank(userModel.getUsername())) {
            return false;
        }
        //todo 数据验证
        // 登录名唯一
        return isEmployeeNameUnique(userModel.getId(), userModel.getUsername());
    }

    public boolean isPasswdValid(String passwd, String continuePasswd) {
        return StringUtils.isNotBlank(passwd) &&
                passwd.equals(continuePasswd);
    }

    public boolean isValid(Long userId) {
        return userId != null && isValid(Collections.singletonList(userId));
    }

    /**
     * 验证用户id集合是否存在
     *
     * @param userIds
     *
     * @return
     */
    public boolean isValid(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            log.error("userId Set 参数不能为空");
            throw new RuntimeException();
        }

        List<User> users = selectBatchIds(userIds);
        if (users == null ||
                users.size() != userIds.size()) {
            throw new RuntimeException("员工不存在");
        }

        return true;
    }

    /**
     * 验证员工姓名唯一
     *
     * @param employeeName
     *
     * @return
     */
    public boolean isEmployeeNameUnique(String employeeName) {
        if (StringUtils.isBlank(employeeName)) {
            throw new RuntimeException("缺失员工姓名");
        }
        Wrapper<User> params = new EntityWrapper<>();
        params.eq("username", employeeName);
        return selectOne(params) == null;
    }

    public boolean isEmployeeNameUnique(Long userId, String employeeName) {
        if (StringUtils.isBlank(employeeName)) {
            throw new RuntimeException("缺失员工姓名");
        }
        boolean uniqueLoginName = isEmployeeNameUnique(employeeName);
        if (uniqueLoginName) {
            return true;
        }

        if (userId != null) {
            User user = selectById(userId);
            if (user == null) {
                throw new RuntimeException("员工不存在");
            }
            return user.getUsername().equals(employeeName);
        }
        return false;
    }

    /**
     * 验证登录名唯一
     *
     * @param loginName
     *
     * @return
     */
    public boolean isLoginNameUnique(String loginName) {
        if (StringUtils.isBlank(loginName)) {
            throw new RuntimeException("缺失登录名");
        }
        return getByLoginName(loginName) == null;
    }

    public boolean isLoginNameUnique(Long userId, String loginName) {
        if (StringUtils.isBlank(loginName)) {
            throw new RuntimeException("缺失登录名");
        }

        User user = getByLoginName(loginName);
        return user == null || (userId != null && user.getId().equals(userId));
    }

    public void logoffPosition(Long positionId, List<Long> userIds) {
        Map<String, Object> params = new HashedMap();
        params.put("positionId", positionId);
        params.put("userIds", userIds);
        this.userDao.logoffPosition(params);
    }

    public List<User> autoComplete(Long positionId, @NonNull String q) {
        val param = new HashMap<String, Object>(4);
        val match = DIGITAL.matcher(q);
        if (match.matches()) {
            param.put("noLike", q);
        } else {
            param.put("nameLike", q);
        }
        if (positionId != null) {
            param.put("positionId", positionId);
        }
        Page<User> page = new Page<>(1, 20);
        return userDao.selectWithLikeNoOrName(page, param);
    }

    public List<User> listByPosition(Long positionId) {
        User params = new User();
        params.setPositionId(positionId);
        List<User> users = selectList(new EntityWrapper<>(params));
        return users;
    }
}

