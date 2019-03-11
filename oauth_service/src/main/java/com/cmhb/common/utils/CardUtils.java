package com.cmhb.common.utils;

public class CardUtils
{
	/**银行卡的格式 */    
    public static final String CURRENCY_FEN_REGEX = "^\\d{16,19}$";    
	
	 public static String changeCard(String cardCode) throws IllegalArgumentException
	 {
		 if(!cardCode.toString().matches(CURRENCY_FEN_REGEX))
		 {
			 throw new IllegalArgumentException("银行卡格式有误");
		 }
		 int length = cardCode.length();
		 String code = cardCode.substring(0,4)+"****"+cardCode.substring(length-4);
		 
		 return code;
	 }
	 public static String getSuffix(String cardCode) throws IllegalArgumentException
	 {
		 if(!cardCode.toString().matches(CURRENCY_FEN_REGEX))
		 {
			 throw new IllegalArgumentException("银行卡格式有误");
		 }
		 int length = cardCode.length();
		 String code = cardCode.substring(length-4);
		 
		 return code;
	 }
}
