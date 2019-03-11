package com.cmhb.common.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class CU {
	
	public static boolean eq(Object o1, Object o2){
		return o1 == null ? o2 == null : o2 == null ? false : o1.equals(o2);
	}
	/*public static boolean eq(Date date1, Date date2){
		return date1 == null ? date2 == null : date2 == null ? false : date1.before(date2) ? false : date1.after(date2) ? false : true;
	}*/
	public static boolean isEmpty(String s){
		return s == null ? true : "".equals(s);
	}
	public static void main(String[] args) throws Exception {
		/*System.out.println(CU.eq("aaa", "aaa"));
		System.out.println(CU.eq("bbb", "aaa"));
		System.out.println(CU.eq(null, null));
		System.out.println(CU.eq(null, "bbb"));
		System.out.println(CU.eq("aaa", null));
		System.out.println(new Object().equals(null));*/
		
		/*System.out.println(isEmpty(""));
		System.out.println(isEmpty(null));
		System.out.println(isEmpty("1"));*/
		
		/*System.out.println(CU.isEmpty(""));
		System.out.println(CU.isEmpty(null));*/
		
		
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		Date date1 = simpleDateFormat.parse("2016-01-01 00:00:01.501");
		Date date2 = simpleDateFormat.parse("2016-01-01 00:00:01.500");
		System.out.println(CU.eq(date2, date1));
		
		
	}

}
