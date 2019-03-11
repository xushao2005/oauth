package com.cmhb.common.utils;

import com.cmhb.enums.RoundBase;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * Class Description : StringHelper is a class used to deal String
 * 
 * @version 1.0 Dec 2, 2008
 * @author cf
 * 
 */
public class StringHelper {

	private static final Pattern NUMBER = Pattern.compile("-?[0-9]+.?[0-9]+");
	/**
	 * 判断字符串是否为空 
	 * 
	 * @param str
	 * @return
	 */
	public static Boolean ifNull(String str){
		if(str==null|| "".equals(str.trim()) || "null".equalsIgnoreCase(str.trim())){
	        return true;  
	    }else{  
	        return false;  
	    }  
	}
	public static String[] StringSort(String[] str) {
		MyString mySs[] = new MyString[str.length];// 创建自定义排序的数组
		for (int i = 0; i < str.length; i++) {
			mySs[i] = new MyString(str[i]);
		}
		Arrays.sort(mySs);// 排序
		String[] str2 = new String[mySs.length];
		for (int i = 0; i < mySs.length; i++) {
			str2[i] = mySs[i].s;
		}
		return str2;
	}
	
	/**
	 * 首字母大写
	 * 
	 * @param s
	 * @return
	 */
	public static String firstCharUpperCase(String s) {
		StringBuffer sb = new StringBuffer(s.substring(0, 1).toUpperCase());
		sb.append(s.substring(1, s.length()));
		return sb.toString();
	}
	
	/**
	 * 是否为中文
	 * 
	 * @param str
	 * @return
	 */
	public static Boolean ifCN(String str) {
		Boolean flag=null;
		try {
			
			if (str.length() == str.getBytes("UTF-8").length) {
				flag =false;
			} else {
				flag =true;
			}

		} catch (Exception e) {
		}
		return flag;
	}

	/**
	 * 转义字符到HTML
	 * 
	 * @param str
	 * @return
	 */
	public static String esc2HTML(String str) {
		try {
			str = str.replaceAll(" ", "&nbsp;");
			str = str.replaceAll("\\r", "&nbsp;");
			str = str.replaceAll("\\n", "<br>");
			return str;
		} catch (Exception e) {
			return null;
		}

	}

	/**
	 * 数组转哈希集合对象
	 * 
	 * @param obj
	 * @return
	 */
	public static Map<Integer, Object> array2HashMap(Object[] obj) {
		Integer i = null;
		Map<Integer, Object> reMap = null;
		try {
			reMap = new HashMap<Integer, Object>();
			for (i = 0; i < obj.length; i++) {
				reMap.put(i, obj[i]);
			}
			return reMap;
		} catch (Exception e) {
			return null;
		} finally {
			i = null;
			reMap = null;
		}

	}

	/**
	 * 数组转树集合对象
	 * 
	 * @param obj
	 * @return
	 */
	public static Map<Object, Object> array2TreeMap(Object[] obj) {
		Integer i = null;
		Map<Object, Object> reMap = null;
		try {
			reMap = new TreeMap<Object, Object>();
			for (i = 0; i < obj.length; i++) {
				reMap.put(obj[i], obj[i]);
			}
			return reMap;
		} catch (Exception e) {
			return null;
		} finally {
			i = null;
			reMap = null;
		}

	}

	/**
	 * 缩写处理
	 * 
	 * @param str
	 * @param width
	 * @param ellipsis
	 * @return
	 */
	public static String abbreviate(String str, int width, String ellipsis) {
		Integer d = 0; // byte length
		Integer n = 0; // char length
		try {
			if (str == null || "".equals(str)) {
				return "";
			}

			for (n = 0; n < str.length(); n++) {
				d = (int) str.charAt(n) > 256 ? d + 2 : d + 1;
				if (d > width) {
					break;
				}
			}

			if (d > width) {
				n = n - ellipsis.length() / 2;
				return str.substring(0, n > 0 ? n : 0) + ellipsis;
			}

			return str = str.substring(0, n);
		} catch (Exception e) {
			return null;
		} finally {
			d = null;
			n = null;
		}

	}

	/**
	 * HTML到文本
	 * 
	 * @param str
	 * @return
	 */
	public static String html2Text(String str) {
		String sciprtReg = null;
		String styleReg = null;
		String tagDulReg = null;
		String tagSigReg = null;
		Pattern scriptPattern = null;
		Matcher scriptMatcher = null;
		Pattern stylePattern = null;
		Matcher styleMatcher = null;
		Pattern tagDulPattern = null;
		Matcher tagDulMatcher = null;
		Pattern tagSigPattern = null;
		Matcher tagSigMatcher = null;
		try {
			// 定义脚本的正则表达式
			sciprtReg = "<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?script[\\s]*?>";

			// 定义style的正则表达式
			styleReg = "<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?style[\\s]*?>";

			// 定义HTML含结束符标签的正则表达式
			tagDulReg = "<[^>]+>";

			// 定义HTML不含结束符标签的正则表达式
			tagSigReg = "<[^>]+";

			// 过滤script标签
			scriptPattern = Pattern.compile(sciprtReg, Pattern.CASE_INSENSITIVE);
			scriptMatcher = scriptPattern.matcher(str);
			str = scriptMatcher.replaceAll("");

			// 过滤style标签
			stylePattern = Pattern.compile(styleReg, Pattern.CASE_INSENSITIVE);
			styleMatcher = stylePattern.matcher(str);
			str = styleMatcher.replaceAll("");

			// 过滤HTML含结束符标签
			tagDulPattern = Pattern.compile(tagDulReg, Pattern.CASE_INSENSITIVE);
			tagDulMatcher = tagDulPattern.matcher(str);
			str = tagDulMatcher.replaceAll("");

			// 过滤HTML不含结束符标签
			tagSigPattern = Pattern.compile(tagSigReg, Pattern.CASE_INSENSITIVE);
			tagSigMatcher = tagSigPattern.matcher(str);
			str = tagSigMatcher.replaceAll("");

			// 过滤空格
			str = str.replace("&nbsp;", "");

			return str;
		} catch (Exception e) {
			return null;
		} finally {
			sciprtReg = null;
			styleReg = null;
			tagDulReg = null;
			tagSigReg = null;
			scriptPattern = null;
			scriptMatcher = null;
			stylePattern = null;
			styleMatcher = null;
			tagDulPattern = null;
			tagDulMatcher = null;
			tagSigPattern = null;
			tagSigMatcher = null;
		}

	}

	/**
	 * 
	 * 基本功能：过滤指定标签
	 * <p>
	 * 
	 * @param str
	 * @param tag
	 * @return String
	 */
	public static String fiterHtmlTag(String str, String tag) {
		String regxp = null;
		StringBuffer sb = null;
		Pattern pattern = null;
		Matcher matcher = null;
		try {
			regxp = "<\\s*" + tag + "\\s+([^>]*)\\s*>";
			pattern = Pattern.compile(regxp);
			matcher = pattern.matcher(str);

			sb = new StringBuffer();
			while (matcher.find()) {
				matcher.appendReplacement(sb, "");
			}
			matcher.appendTail(sb);
			return sb.toString();
		} catch (Exception e) {
			return null;
		} finally {
			regxp = null;
			sb = null;
			pattern = null;
			matcher = null;
		}
	}

	/**
	 * 把整形数字前置0生成固定长度的字符串，如果原字符串大于或等于固定长度则直接返回
	 * 
	 * 
	 * @param num
	 * @param len
	 * @return
	 */
	public static String int2FixString(Integer num, int len) {
		String strnum = null;
		Integer zeronum = null;
		Integer i = null;
		String restr = null;
		try {
			strnum = num.toString();
			restr = strnum;

			if (strnum.length() < len) {
				zeronum = len - strnum.length();
				for (i = 0; i < zeronum; i++) {
					restr = "0" + restr;
				}
			}

			return restr;
		} catch (Exception e) {
			return null;
		} finally {
			strnum = null;
			zeronum = null;
			i = null;
			restr = null;
		}
	}

	/**
	 * 把字符串分隔成数组
	 * 
	 * @param inputString
	 * @param splitFlag
	 * @return stringList
	 */
	public static List<String> string2List(String inputString, String splitFlag) {
		String[] stringArray = null;
		List<String> stringList = null;
		try {
			if (null != inputString && inputString.indexOf(splitFlag) > 0) {
				stringArray = inputString.split(splitFlag);
				stringList = new ArrayList<String>(0);
				for (String t : stringArray) {
					stringList.add(t);
				}
				return stringList;
			} else {
				return null;
			}
		} catch (Exception e) {
			return null;
		} finally {
			stringArray = null;
			stringList = null;
		}
	}
	
	/**
	 * 数组到字符串
	 * 
	 * @param arr
	 * @return
	 */
	public static String arr2Str(Integer[] arr) {
		String str = null;
		try {
			if (null != arr) {
				for (Integer i : arr) {
					if (null == str) {
						str = i.toString();
					} else {
						str = str + "," + i.toString();
					}
				}
			}
			return str;
		} catch (Exception e) {
			return null;
		} finally {
			str = null;
		}
	}

	/**
	 * 字符串到数组
	 * 
	 * @param str
	 * @return
	 */
	public static Integer[] str2Arr(String str) {
		String[] strs = null;
		Integer[] arr = null;
		try {
			if(null!=str&&!str.isEmpty()){
				strs = str.split(",");
				arr = new Integer[strs.length];
				for (int i = 0; i < strs.length; i++) {
					arr[i] = Integer.valueOf(strs[i]);
				}
			}
			return arr;
		} catch (Exception e) {
			return null;
		} finally {
			arr = null;
			strs = null;
		}
	}
	

	/**
	 * 获取文件名称
	 * 
	 * @param content
	 * @param fix
	 * @param split
	 * @return
	 */
	public static String getFileNames(String content, String fix, String split) {
		String onePic = "";
		String picStr = "";
		String tempCont = content.trim();
		Integer sit = tempCont.indexOf(fix);
		try {
			while (sit != -1) {
				int tempSit = tempCont.lastIndexOf((int) '/', sit);
				onePic = tempCont.substring(tempSit + 1, sit);
				picStr = picStr + onePic + fix + split;
				tempCont = tempCont.substring(sit + 2, tempCont.length() - 1);
				sit = tempCont.indexOf(fix);
			}
			return picStr;
		} catch (Exception e) {
			return null;
		} finally {
			onePic = null;
			picStr = null;
			tempCont = null;
			sit = null;
		}

	}

	/**
	 * 获取文件扩展名（包括点）
	 * 
	 * @author wyj
	 * @param fileName
	 * @return
	 */
	public static String getFileTypeIncludePoint(String fileName) {
		return fileName.substring(fileName.lastIndexOf("."), fileName.length());
	}

	/**
	 * 获取文件扩展名（不包括点）
	 * 
	 * @author wyj
	 * @param fileName
	 * @return
	 */
	public static String getFileTypeExcludePoint(String fileName) {
		return fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
	}

	/**
	 * 判断是否是数字
	 * 
	 * @param str
	 * @return
	 */
	public static boolean ifNumeric(String str) {
		if (str.matches("\\d*")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 判断是否是字母
	 * 
	 * @param str
	 * @return
	 */
	public static boolean ifChart(String str) {
		if (str.matches("\\w*")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 判断是否是字母
	 * 
	 * @param c
	 * @return
	 */
	public static boolean ifLetter(char c) {   
	     return c / 0x80 == 0 ? true : false;   
	}
	
	/**
	 * 获取N位随机数
	 * @param length
	 * @return
	 */
	public static String getSeq(int length){
		Random random = new Random();
		StringBuffer buffer = new StringBuffer();
        for(int i = 0; i < length; i++){
        	buffer.append(random.nextInt(10));//取三个随机数追加到StringBuffer
        }
        return buffer.toString();
	}
	
	/**
	 * 在指定的字符串中获取其中任意一个字符
	 * @param str
	 * @return
	 */
	public static String getRandomStr(String str){		
		String[] strs = str.split(",");
		if(null != strs && strs.length > 0){
			int index = (int) (Math.random() *  strs.length);// 随机数乘以数组长度，那么它的取值就在0-length之间
            return strs[index]; 
		}else {
            return null;
        }
	}
	

	/**
	 * 将字符串转换成ASCII码
	 * 
	 * @param cnStr
	 * @return String
	 */
	public static String getCnASCII(String cnStr) {
		StringBuffer strBuf = null;
		try{
			strBuf = new StringBuffer();
			
			// 将字符串转换成字节序列
			byte[] bGBK = cnStr.getBytes("UFT-8");
			
			for (int i = 0; i < bGBK.length; i++) {
				// 将每个字符转换成ASCII码
				strBuf.append(Integer.toHexString(bGBK[i] & 0xff));
			}
			
			return strBuf.toString();
		}catch(Exception e){
			return null;
		}finally{
			strBuf = null;
		}
	}	
	
	
	/**
	 * 获取小数点位数
	 * 
	 * @param num
	 * @return
	 */
	public static int getScale(String num){
		int pos = num.lastIndexOf(".");
		return num.substring(pos+1).length();
	}
	
	/**
	 * 
	* @Title: getSerialNumber 
	* @Description: TODO(生成唯一流水号规则为 coCode（7 位）
+YYYYMMDDHHMMSS(1
4 位)+5 位流水号) 
	* @param @return    设定文件 
	* @return String    返回类型 
	* @throws
	 */
	public static String getSerialNumber(String coCode){
		StringBuffer sb =new StringBuffer();
		sb.append(coCode);
        sb.append(com.cmhb.common.utils.DateTimeHelper.getDateTimeNoGap());
        int hashCode = UUID.randomUUID().toString().hashCode();
    	if(hashCode < 0) {
    	hashCode = - hashCode;
    	}
    	String str =String.format("%010d", hashCode).substring(5);
		sb.append(str);
		return sb.toString();
	}
	
	/**
	 * 
	* @Title: getSerialNumber 
	* @Description: TODO(生成唯一流水号规则为 coCode（7 位）+YYYYMMDDHHMMSS(14 位)+5 位流水号) 
	* @param @return    设定文件 
	* @return String    返回类型 
	* @throws
	 */
	public static String getPkid(){
		StringBuffer sb =new StringBuffer();
		sb.append(DateTimeHelper.getDateTimeNoGap());
		int hashCode = UUID.randomUUID().toString().hashCode();
    	if(hashCode < 0) {
    		hashCode = - hashCode;
    	}
    	String str =String.format("%010d", hashCode);
		sb.append(str);
		return sb.toString();
	}

	/**
	 * Double转成字符串
	 * @param num
	 * @return
	 */
	public static String double2String(Double num){
		return null != num ? String.valueOf(num) : "";
	}

    public static String numberToString(BigDecimal num) {
        if (num == null) {
            return "";
        }
        RoundBase base = RoundBase.DEFAULT;
        if (num.compareTo(RoundBase.HUNDRED_MILLION.getValue()) >= 0) {
            base = RoundBase.HUNDRED_MILLION;
        } else if (num.compareTo(RoundBase.TEN_THOUSAND.getValue()) >= 0) {
            base = RoundBase.TEN_THOUSAND;
        }

        return num.divide(base.getValue(), 0, RoundingMode.HALF_EVEN).toString() + base.getUnit();
    }

	/**
	 * Integer转成字符串
	 * @param num
	 * @return
	 */
	public static String integer2String(Integer num){
		return null != num ? String.valueOf(num) : "";
	}
	
	/**
	 * 是否为数字,包括正负数，小数
	 * */
	public static boolean isNumeric(String str){
		   Matcher isNum = NUMBER.matcher(str);
		   if( !isNum.matches() ){
		       return false; 
		   } 
		   return true; 
	}

	@SneakyThrows
	public static String getSubStr(List<String> list, int len)
	{
		if (list == null || list.isEmpty())
		{
			return "";
		}
		String strs = list.toString();
		if (StringUtils.isNotBlank(strs) && len > 0)
		{
			// 取得该字符串的字节长度
			int length = strs.getBytes("UFT-8").length;
			// 全部不包括汉
			if (len == length)
			{
				// 如果截取长度是字符串长度以内,就substring,否则就取这个字符串
				if (len < length)
				{
					strs = strs.substring(1, len) + "...";
				}
				else
				{
					return strs;
				}
			} // 含有汉字
			else
			{
				StringBuffer sb = new StringBuffer();
				// 截取算法 遍历字符串,并且监测a值
				for (int i = 0; i < strs.length() && len >= 0; i++)
				{
					// 如果是汉字算2个长度。
					if (strs.charAt(i) >= '\u4e00'
					        && strs.charAt(i) <= '\u9fa5')
					{
						// 如果是汉字且不是最后一个字符，就加上，否则不加
						sb.append(strs.charAt(i));
						len -= 2;
						// 不是汉字只算一个长度
					}
					else
					{
						sb.append(strs.charAt(i));
						len--;
					}
				}
				if (len < 0) {
                    strs = sb.toString() + "...";
                } else {
                    strs = sb.toString();
                }
			}
		}

		return strs;

	}

	@SneakyThrows
	public static String getSubStr(String str, int len)
	{
		if(StringUtils.isBlank(str)){
			return "";
		}
		if (len > 0)
		{
			// 取得该字符串的字节长度
			int length = str.getBytes("UFT-8").length;
			// 全部不包括汉
			if (len == length)
			{
				// 如果截取长度是字符串长度以内,就substring,否则就取这个字符串
				if (len < length)
				{
					str = str.substring(1, len) + "...";
				}
				else
				{
					return str;
				}
			} // 含有汉字
			else
			{
				StringBuffer sb = new StringBuffer();
				// 截取算法 遍历字符串,并且监测a值
				for (int i = 0; i < str.length() && len >= 0; i++)
				{
					// 如果是汉字算2个长度。
					if (str.charAt(i) >= '\u4e00' && str.charAt(i) <= '\u9fa5')
					{
						// 如果是汉字且不是最后一个字符，就加上，否则不加
						sb.append(str.charAt(i));
						len -= 2;
						// 不是汉字只算一个长度
					}
					else
					{
						sb.append(str.charAt(i));
						len--;
					}
				}
				if (len < 0) {
                    str = sb.toString() + "...";
                } else {
                    str = sb.toString();
                }
			}
		}
		return str;
	}
	
	public static String getSubStrByChar(String str, int len)
	{
		if(StringUtils.isBlank(str)){
			return "";
		}
		if(str.length() <= len){
			return str;
		}
		return str.substring(0, len)+"...";
	}
}

class MyString implements Comparable<MyString> {
    public String s;// 包装String

    public MyString(String s) {
        this.s = s;
    }

    @Override
    public int compareTo(MyString o) {
        if (o == null || o.s == null) {
            return 1;
        }
        return s.compareTo(o.s);
    }
}