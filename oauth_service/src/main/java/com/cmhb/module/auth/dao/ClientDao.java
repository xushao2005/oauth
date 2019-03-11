package com.cmhb.module.auth.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.cmhb.module.auth.domain.Client;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * <p>
  * ${table.comment} Mapper 接口
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
public interface ClientDao extends BaseMapper<Client> {
    Client findByAppId(String appId);

    Client findByClientSecret(@Param("secretKey") String secretKey);

    List<Client> selectAll(Map<String, Object> params);

    /**
     * 更新client，不包括secretKey和appId
     *
     * @param client client
     * @return
     */
    int update(Client client);

    List<Client> selectDistinctClients();
}