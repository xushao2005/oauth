package com.cmhb.module.auth.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.dao.ClientDao;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.oauth2.model.ClientModel;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * <p>
 * ${table.comment} 服务类
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
@Service
public class ClientService extends ServiceImpl<ClientDao, Client> {
    @Autowired
    private ClientDao clientDao;
    @Autowired
    private UserService userService;
    @Autowired
    private RelClientUserService relClientUserService;


    public List<Client> findList(Map<String, Object> params) {
        List<Client> clients = clientDao.selectAll(params);
        return clients;
    }


    public Client createClient(ClientModel clientDto) {
        Client client = BeanMapper.map(clientDto, Client.class);
        client.setSecretKey(UUID.randomUUID().toString());
        client.setAppId(UUID.randomUUID().toString());
        clientDao.insert(client);
        return client;
    }


    public Client findByAppId(String appId) {
        if (appId == null) {
            return null;
        }
        return clientDao.findByAppId(appId);
    }


    public Client findByClientSecret(String clientSecret) {
        return clientDao.findByClientSecret(clientSecret);
    }

    /**
     * 获取应用下所有用户
     *
     * @param clientId
     *
     * @return
     */

    public List<User> getAllUsers(Long clientId) {
        List<User> users = new ArrayList<User>();
        List<Long> userIds = relClientUserService.findByClient(clientId);
        for (Long userId : userIds) {
            User user = userService.selectById(userId);
            if (user != null) {
                users.add(user);
            }
        }
        return users;
    }

    /**
     * 更新client信息，不包括secret和appId
     *
     * @param client client
     * @return
     */

    public boolean updateBasic(Client client) {
        client.setSecretKey(null);
        client.setAppId(null);
        return clientDao.update(client) > 0;
    }

    /**
     * id->name 映射
     *
     * @return
     */

    public Map<Long, String> getIdNameMapper() {
        List<Client> clients = clientDao.selectList(null);
        Map<Long, String> mapper = new HashMap<Long, String>();
        for (Client client : clients) {
            mapper.put(client.getId(), client.getApplicationName());
        }
        return mapper;
    }

    /**
     * 获取所有业务系统id
     *
     * @return id->applicationName
     */

    public Map<Long, String> getDistinctClients() {
        List<Client> clients = clientDao.selectDistinctClients();

        Map<Long, String> id2Name = new HashMap<>();
        for (Client client : clients) {
            id2Name.put(client.getId(), client.getApplicationName());
        }

        return id2Name;
    }

    public Client findByRedirectUrl(String redirectUrl) {
        if (StringUtils.isBlank(redirectUrl)) {
            throw new IllegalArgumentException("回调地址不能为空");
        }
        Client params = new Client();
        params.setRedirectUri(redirectUrl);
        Wrapper<Client> wrapper = new EntityWrapper<>(params);
        return selectOne(wrapper);
    }

    /**
     * 回调地址是否唯一
     *
     * @param redirectUrl
     *
     * @return
     */
    public boolean isRedirectUrlUnique(String redirectUrl) {
        return findByClientSecret(redirectUrl) == null;
    }

    public boolean isRedirectUrlUnique(long id, String redirectUrl) {
        Client client = findByRedirectUrl(redirectUrl);
        return client == null || client.getId() == id;

    }
}
