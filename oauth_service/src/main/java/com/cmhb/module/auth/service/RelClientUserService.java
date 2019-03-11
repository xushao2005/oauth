package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.module.auth.dao.RelClientUserDao;
import com.cmhb.module.auth.domain.RelClientUser;
import com.cmhb.module.auth.domain.User;
import lombok.val;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * <p>
 * ${table.comment} 服务类
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
@Service
public class RelClientUserService extends ServiceImpl<RelClientUserDao, RelClientUser> {
    @Resource
    private RelClientUserDao relClientUserDao;
    @Resource
    private ClientService clientService;
    @Resource
    private UserService userService;

    /**
     * 用户添加应用
     * @param clientId 应用id
     * @param userIds  用户id
     */
    public void addUserToClient(Long clientId, long... userIds) {
        for (Long userId : userIds) {
            createRel(userId, clientId);
        }
    }

    /**
     * 应用添加用户
     * @param userId    用户id
     * @param clientIds 应用id
     */
    public void addClientToUser(Long userId, long... clientIds) {
        for (long clientId : clientIds) {
            createRel(userId, clientId);
        }
    }


    public void deleteUser(Long userId) {
        val param = new RelClientUser();
        param.setUserId(userId);
        Wrapper<RelClientUser> wrapper = new EntityWrapper<>(param);
        relClientUserDao.delete(wrapper);
    }

    /**
     * 删除应用下所有用户
     * @param clientId 应用id
     */
    public void deleteClient(long clientId) {
        val param = new RelClientUser();
        param.setClientId(clientId);
        Wrapper<RelClientUser> wrapper = new EntityWrapper<>(param);
        relClientUserDao.delete(wrapper);
    }


    public boolean deleteOwnClient(Long userId, Long clientId) {
        val param = new RelClientUser();
        param.setUserId(userId);
        param.setClientId(clientId);
        Wrapper<RelClientUser> wrapper = new EntityWrapper<>(param);
        return relClientUserDao.delete(wrapper) > 0;
    }

    /**
     * 校验新的用户应用关系
     * 用户存在 应用存在 关系不存在
     * @param userId   用户id
     * @param clientId 应用id
     *
     * @return
     */
    public boolean checkNewRel(Long userId, Long clientId) {
        User user = userService.selectById(userId);
        if (user == null) {
            return false;
        }
        if (clientService.selectById(clientId) == null) {
            return false;
        }
        val param = new RelClientUser();
        param.setUserId(user.getId());
        param.setClientId(clientId);
        if (relClientUserDao.selectOne(param) == null) {
            return false;
        }
        return true;
    }

    /**
     * 查找
     * @param userId
     * @param clientId
     * @return
     */
    public RelClientUser find(Long userId, Long clientId) {
        val relUserClient = new RelClientUser();
        relUserClient.setUserId(userId);
        relUserClient.setClientId(clientId);
        Wrapper<RelClientUser> wrapper = new EntityWrapper<RelClientUser>(relUserClient);
        return selectOne(wrapper);
    }

    /**
     * 给用户添加一个应用权限
     * @param userId   用户id
     * @param clientId 应用id
     * @return
     */
    public boolean createRel(Long userId, Long clientId) {
        if (find(userId, clientId) == null) {
            RelClientUser relClientUser = new RelClientUser();
            relClientUser.setClientId(clientId);
            relClientUser.setUserId(userId);
            return relClientUserDao.insert(relClientUser) > 0;
        }
        return false;
    }

    /**
     * 查找用户下的应用
     *
     * @param clientId
     *
     * @return
     */
    public List<Long> findByClient(Long clientId) {
        return relClientUserDao.selectByClientId(clientId);
    }
}

