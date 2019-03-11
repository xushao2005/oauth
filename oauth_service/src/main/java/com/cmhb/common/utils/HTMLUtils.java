package com.cmhb.common.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HTMLUtils
{
	private static Pattern pHtml = Pattern.compile("<[^>]+>", Pattern.CASE_INSENSITIVE); 

	public static String filterHtml(String input) 
	{
		Matcher m = pHtml.matcher(input);
		String returnVal = m.replaceAll("");
		return returnVal;
	}
	
	public static void main(String args[]) {
		System.out.println(HTMLUtils.filterHtml("<p><font style='color:red'>red</font><img src='test' />plain</p>"));
	}
}
