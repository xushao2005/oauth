package com.cmhb.module.auth.model;

import lombok.Data;

import java.util.List;

/**
 * Created by 施杭波 on 2017/01/11
 */
@Data
public class UserConnectDutyModel {
    private String dutyId;
    private List<Long> users;
}
