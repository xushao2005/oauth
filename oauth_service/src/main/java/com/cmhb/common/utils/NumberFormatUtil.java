package com.cmhb.common.utils;

import java.math.BigDecimal;

public class NumberFormatUtil {
	
	private static final String div100000format = "%.2f";
	private static final String format5f = "%.5f";
	
	
	public static void main(String[] args) {
		System.out.println(format5f(new BigDecimal(99999999999.00)));
	}
	
	public static String div100000(Integer integer){
		return String.format(div100000format, integer == null ? 0.0 : integer / 100000.0);
	}
	
	public static String div100000(Double double1){
		return String.format(div100000format, double1 == null ? 0.0 : double1 / 100000.0);
	}
	
	public static String div100000(Float float1){
		return String.format(div100000format, float1 == null ? 0.0 : float1 / 100000.0);
	}
	
	public static String format5f(BigDecimal bigDecimal){
		if(null != bigDecimal){
			return String.format(format5f, bigDecimal);
		}
		return null;
	}
	
}
