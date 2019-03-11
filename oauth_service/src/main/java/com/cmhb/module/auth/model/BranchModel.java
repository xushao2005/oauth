package com.cmhb.module.auth.model;

import lombok.Data;

/**
 * Created by luxp on 2017/8/30.
 */
@Data
public class BranchModel {
    private Long id;
    private String code;
    private String name;
    private String nameSpell;
    private Boolean statusId;
    private String area;
    private String warehouseCode;
    private String areaCode;
    private Integer baudRate;
    private String isBelong;
    private String cainiaoWarehouseCode;
    private String abbreviationName;
}
