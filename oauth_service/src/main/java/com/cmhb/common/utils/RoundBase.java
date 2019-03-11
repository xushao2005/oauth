package com.cmhb.common.utils;

import java.math.BigDecimal;

/**
 * Created by luxp on 2017/5/8.
 */
public enum RoundBase {
    DEFAULT(new BigDecimal(1), "个位", ""),
    TEN_THOUSAND(new BigDecimal(10000), "万位", "万"),
    HUNDRED_MILLION(new BigDecimal(100000000), "亿位", "亿");

    /**
     * 值
     */
    private BigDecimal value;
    /**
     * 描述
     */
    private String desc;

    /**
     * 单位名
     */
    private String unit;

    RoundBase(BigDecimal value, String desc, String unit) {
        this.value = value;
        this.desc = desc;
        this.unit = unit;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
