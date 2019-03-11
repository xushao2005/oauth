package com.cmhb.common.utils;

import java.util.Random;

public class MessageUtils
{
	public static String getCode(){
		Random random = new Random();
		String content = random.nextInt(899999) + 100000 +"";
		
		return content;
	}
}
