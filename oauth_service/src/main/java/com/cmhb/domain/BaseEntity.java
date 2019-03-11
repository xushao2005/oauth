package com.cmhb.domain;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Entity基类.
 * 
 */
@Data
public abstract class BaseEntity implements Serializable {
	private static final long serialVersionUID = 2734951563954109759L;

    public static final int EXISTENT = 1;
    public static final int DELETED = 0;

    @TableId(type = IdType.ID_WORKER)
    private Long id;
    @JsonIgnore
    @TableField(value = "status")
    private Integer status;
    @JsonIgnore
    @TableField(value = "add_time")
    private LocalDateTime addTime;
    @JsonIgnore
    @TableField(value = "mod_time")
    private LocalDateTime modTime;
}

