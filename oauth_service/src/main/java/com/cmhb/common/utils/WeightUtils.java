package com.cmhb.common.utils;

import java.math.BigDecimal;

public class WeightUtils {    
        
    /**重量的格式 */    
    public static final String CURRENCY_FEN_REGEX = "\\-?[0-9]+";    
        
    /**   
     * 将克为单位的转换为千克并返回重量格式的字符串 （除1000）  
     *   
     * @param amount  
     * @return  
     * @throws Exception   
     */    
    public static String changeG2KG(Long amount) throws IllegalArgumentException{    
        if(!amount.toString().matches(CURRENCY_FEN_REGEX)) {    
            throw new IllegalArgumentException("质量格式有误");    
        }    
        return BigDecimal.valueOf(amount).divide(new BigDecimal(1000)).toString();    
    }   
    
    public static String changeG2KG(Integer amount) throws IllegalArgumentException{    
        if(!amount.toString().matches(CURRENCY_FEN_REGEX)) {    
            throw new IllegalArgumentException("质量格式有误");    
        }    
        return BigDecimal.valueOf(amount).divide(new BigDecimal(1000)).toString();    
    }    
        
    /**  
     * 将克为单位的转换为千克并返回重量格式的字符串 （除1000）  
     *   
     * @param amount  
     * @return  
     * @throws Exception   
     */    
    public static String changeG2KG(String amount) throws IllegalArgumentException{    
        if(!amount.matches(CURRENCY_FEN_REGEX)) {    
            throw new IllegalArgumentException("重量格式有误");
        }    
        return BigDecimal.valueOf(Long.parseLong(amount)).divide(new BigDecimal(1000)).toString();
    }    
        
    /**   
     * 将千克为单位的转换为克 （乘1000）  
     *   
     * @param amount  
     * @return  
     */    
    public static String changeKG2G(Long amount){    
        return BigDecimal.valueOf(amount).multiply(new BigDecimal(1000)).toString();    
    }    
    
    
    /**   
     * 将千克为单位的转换为克 替换小数点，支持以逗号区分的金额  
     *   
     * @param amount  
     * @return  
     */    
    public static String changeKG2G(String amount){    
        String currency =  amount.replaceAll("\\$|\\￥|\\,", "");  //处理包含, ￥ 或者$的金额    
        int index = currency.indexOf(".");    
        int length = currency.length();    
        Long amLong = 0L;
        if(index == -1){    
            amLong = Long.valueOf(currency+"000");    
        }else if(length - index >= 4){    
            amLong = Long.valueOf((currency.substring(0, index+4)).replace(".", ""));    
        }else if(length - index == 3){    
            amLong = Long.valueOf((currency.substring(0, index+3)).replace(".", "")+"0");    
        }else if(length - index == 2){    
            amLong = Long.valueOf((currency.substring(0, index+2)).replace(".", "")+"00");    
        }else{    
            amLong = Long.valueOf((currency.substring(0, index+1)).replace(".", "")+"000");    
        }    
        return amLong.toString();    
    }
}  