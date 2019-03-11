package com.cmhb.common.mybatisplus;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * @description：分页实体类 (结合jqery easyui)
 * @author：Wangzhixuan
 * @date：2015年4月23日 上午1:41:46
 */
@Data
@SuppressWarnings("rawtypes")
@Deprecated
public class PageInfo {

    private final static int PAGESIZE = 10; //默认显示的记录数 

    private int totalCount; // 总记录 
    private List result; //显示的记录  

    @JsonIgnore
    private int from;
    @JsonIgnore
    private int size;
    @JsonIgnore
    private int pageNo; // 当前页 
    @JsonIgnore
    private int pageSize; // 每页显示的记录数 
    @JsonIgnore
    private Map<String, Object> condition; //查询条件

    @JsonIgnore
    private String sort = "seq";// 排序字段
    @JsonIgnore
    private String order = "asc";// asc，desc mybatis Order 关键字

    public PageInfo() {}

    //构造方法
    public PageInfo(int nowpage, int pagesize) {
    	this.pageNo = nowpage;
        this.pageSize = pagesize;
        init();
    }

    // 构造方法
    public PageInfo(int nowpage, int pagesize, String sort, String order) {
    	this.pageNo = nowpage;
        this.pageSize = pagesize;
        init();
        // 排序字段，正序还是反序
        this.sort = sort;
        this.order = order;
    }
    
    public void init() {
        // 计算当前页  
        if (pageNo <= 0) {
            pageNo = 1;
        }
        // 记录每页显示的记录数  
        if (pageSize <= 0) {
            pageSize = PAGESIZE;
        }
        // 计算开始的记录和结束的记录  
        from = (pageNo - 1) * pageSize;
        size = pageSize;
    }

	/**
	 * 根据pageSize与totalCount计算总页数, 默认值为-1.
	 */
	public int getTotalPages()
	{
		if (totalCount < 0)
		{
			return -1;
		}
		int pages = totalCount / pageSize;
		return totalCount % pageSize > 0 ? ++pages : pages;
	}
}
