package com.cmhb.common.utils;

import java.math.BigDecimal;


/**
 * 
 * 元 角 分 厘 毫 丝
 * 
 * @author liuwd
 *
 */
public class MoneyUtils {    
        
    /**金额为分的格式 */    
    public static final String CURRENCY_FEN_REGEX = "\\-?[0-9]+";    
        
    /**   
     * 将丝为单位的转换为元并返回金额格式的字符串 （除100000）  
     *   
     * @param amount  
     * @return  
     * @throws Exception   
     */    
    public static String changeS2Y(Long amount) throws Exception{    
        return BigDecimal.valueOf(Long.valueOf(amount)).divide(new BigDecimal(100000)).toString();   
    }    
        
    /**  
     * 将丝为单位的转换为元 （除100000）  
     *   
     * @param amount  
     * @return  
     * @throws Exception   
     */    
    public static String changeS2Y(String amount) throws Exception{    
        if(!amount.matches(CURRENCY_FEN_REGEX)) {    
            throw new Exception("金额格式有误");    
        }    
        return BigDecimal.valueOf(Long.parseLong(amount)).divide(new BigDecimal(100000)).toString();
    }    
    
    /**   
     * 将元为单位的转换为丝 （乘100000）  
     *   
     * @param amount  
     * @return  
     */    
    public static String changeY2S(Long amount){    
        return BigDecimal.valueOf(amount).multiply(new BigDecimal(100000)).toString();    
    }    
        
    /**   
     * 将元为单位的转换为丝 替换小数点，支持以逗号区分的金额  
     *   
     * @param amount  
     * @return  
     */    
    public static String changeY2S(String amount){    
        String currency =  amount.replaceAll("\\$|\\￥|\\,", "");  //处理包含, ￥ 或者$的金额    
        int index = currency.indexOf(".");    
        int length = currency.length();    
        Long amLong = 0L;
        if(index == -1){    
            amLong = Long.valueOf(currency+"00000");    
        }else if(length - index >= 6){    
            amLong = Long.valueOf((currency.substring(0, index+6)).replace(".", ""));    
        }else if(length - index == 5){    
            amLong = Long.valueOf((currency.substring(0, index+5)).replace(".", "")+"0");    
        }else if(length - index == 4){    
            amLong = Long.valueOf((currency.substring(0, index+4)).replace(".", "")+"00");    
        }else if(length - index == 3){    
            amLong = Long.valueOf((currency.substring(0, index+3)).replace(".", "")+"000");    
        }else if(length - index == 2){    
            amLong = Long.valueOf((currency.substring(0, index+2)).replace(".", "")+"0000");    
        }else{    
            amLong = Long.valueOf((currency.substring(0, index+1)).replace(".", "")+"00000");    
        }    
        return amLong.toString();    
    }
    
    /**
     * 将分为单位的转换为丝并返回金额格式的字符串 （乘1000）  
     * 
     * @param amount
     * @return
     * @throws Exception
     */
    public static String changeF2S(String amount){    
        String currency =  amount.replaceAll("\\$|\\￥|\\,", "");  //处理包含, ￥ 或者$的金额    
        int index = currency.indexOf(".");    
        int length = currency.length();    
        Long amLong = 0L;
        if(index == -1){    
            amLong = Long.valueOf(currency+"000");    
        }else if(length - index >= 4){    
            amLong = Long.valueOf((currency.substring(0, index+4)).replace(".",""));    
        }else if(length - index == 3){    
            amLong = Long.valueOf((currency.substring(0, index+3)).replace(".","")+"0");    
        }else if(length - index == 2){    
            amLong = Long.valueOf((currency.substring(0, index+2)).replace(".", "")+"00");    
        }else{    
            amLong = Long.valueOf((currency.substring(0, index+1)).replace(".", "")+"000");    
        }    
        return amLong.toString();    
    } 
    
    /**   
     * 将分为单位的转换为丝 （乘1000）  
     *   
     * @param amount  
     * @return  
     */    
    public static String changeF2S(Long amount){    
        return BigDecimal.valueOf(amount).multiply(new BigDecimal(1000)).toString();    
    }
    
    /**
     * 将丝为单位的转换为分 （除1000）
     * @param amount
     * @return
     * @throws Exception
     */
    public static String changeS2F(Long amount) throws Exception{    
        if(!amount.toString().matches(CURRENCY_FEN_REGEX)) {    
            throw new Exception("金额格式有误");    
        }    
            
        int flag = 0;    
        String amString = amount.toString();    
        if(amString.charAt(0)=='-'){    
            flag = 1;    
            amString = amString.substring(1);    
        }    
        StringBuffer result = new StringBuffer();    
        if(amString.length()==1){    
            result.append("0.00").append(amString);    
        }else if(amString.length() == 2){    
            result.append("0.0").append(amString);    
        }else if(amString.length() == 3){    
            result.append("0.").append(amString);    
        }else{    
            String intString = amString.substring(0,amString.length()-3);    
            for(int i=1; i<=intString.length();i++){    
                if( (i-1)%3 == 0 && i !=1){    
                    result.append(",");    
                }    
                result.append(intString.substring(intString.length()-i,intString.length()-i+1));    
            }    
            result.reverse().append(".").append(amString.substring(amString.length()-2));    
        }    
        if(flag == 1){    
            return "-"+result.toString();    
        }else{    
            return result.toString();    
        }    
    }   
    
    /**
     * 将丝为单位的转换为元 （除1000）
     * @param amount
     * @return
     * @throws Exception
     */
    public static String changeS2F(String amount) throws Exception{    
    	if(!amount.matches(CURRENCY_FEN_REGEX)) {    
            throw new Exception("金额格式有误");    
        }    
        return BigDecimal.valueOf(Long.parseLong(amount)).divide(new BigDecimal(1000)).toString();
    }
    
    /**  
     * 将分为单位的转换为元 （除100）  
     *   
     * @param amount  
     * @return  
     * @throws Exception   
     */   
    public static String changeF2Y(Long amount) throws Exception{    
        if(!amount.toString().matches(CURRENCY_FEN_REGEX)) {    
            throw new Exception("金额格式有误");    
        }    
            
        int flag = 0;    
        String amString = amount.toString();    
        if(amString.charAt(0)=='-'){    
            flag = 1;    
            amString = amString.substring(1);    
        }    
        StringBuffer result = new StringBuffer();    
        if(amString.length()==1){    
            result.append("0.0").append(amString);    
        }else if(amString.length() == 2){    
            result.append("0.").append(amString);    
        }else{    
            String intString = amString.substring(0,amString.length()-2);    
            for(int i=1; i<=intString.length();i++){    
                if( (i-1)%3 == 0 && i !=1){    
                    result.append(",");    
                }    
                result.append(intString.substring(intString.length()-i,intString.length()-i+1));    
            }    
            result.reverse().append(".").append(amString.substring(amString.length()-2));    
        }    
        if(flag == 1){    
            return "-"+result.toString();    
        }else{    
            return result.toString();    
        }    
    }    
        
    /**  
     * 将分为单位的转换为元 （除100）  
     *   
     * @param amount  
     * @return  
     * @throws Exception   
     */   
    public static String changeF2Y(String amount) throws Exception{    
        if(!amount.matches(CURRENCY_FEN_REGEX)) {    
            throw new Exception("金额格式有误");    
        }    
        return BigDecimal.valueOf(Long.parseLong(amount)).divide(new BigDecimal(100)).toString();
    }    
        
    public static String changeY2F(Long amount){    
        return BigDecimal.valueOf(amount).multiply(new BigDecimal(100)).toString();    
    }    
        
    public static String changeY2F(String amount){    
        String currency =  amount.replaceAll("\\$|\\￥|\\,", "");  //处理包含, ￥ 或者$的金额    
        int index = currency.indexOf(".");    
        int length = currency.length();    
        Long amLong = 0L;
        if(index == -1){    
            amLong = Long.valueOf(currency+"00");    
        }else if(length - index >= 3){    
            amLong = Long.valueOf((currency.substring(0, index+3)).replace(".", ""));    
        }else if(length - index == 2){    
            amLong = Long.valueOf((currency.substring(0, index+2)).replace(".", "")+0);    
        }else{    
            amLong = Long.valueOf((currency.substring(0, index+1)).replace(".", "")+"00");    
        }    
        return amLong.toString();    
    }    
        
        
    public static void main(String[] args) {    
//        try {    
//            System.out.println("结果："+changeS2Y("-000a00"));    
//        } catch(Exception e){    
//            System.out.println("----------->>>"+e.getMessage());    
////          return e.getErrorCode();    
//        }     
//      System.out.println("结果："+changeY2S("1.00000000001E10"));    
            
        
        try {  
            System.out.println(MoneyUtils.changeS2Y(2050000L));  
            
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        
        
//        System.out.println(Long.parseLong(AmountUtils.changeY2S("1000000000000000")));    
//        System.out.println(Integer.parseInt(AmountUtils.changeY2S("10000000")));    
//        System.out.println(Integer.MIN_VALUE);    
//        long a = 0;    
//        System.out.println(a);    
            
    }    
}  