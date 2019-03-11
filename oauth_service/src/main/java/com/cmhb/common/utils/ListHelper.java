package com.cmhb.common.utils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ListHelper
{
	/**
	 * 去除list集合中重复项
	 * @param list
	 * @return 
	 * @exception 
	 * @since 2016-8-17 下午3:14:01
	 * @author 陈强
	 */
	public static List<String> removeDuplicate(List<String> list)
	{
		Set<String> set = new HashSet<String>();
		for (String str : list)
		{
			set.add(str);
		}
		list = new ArrayList<>(set);
		return list;
	}

}
