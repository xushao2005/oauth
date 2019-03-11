package com.cmhb.common.utils;

import lombok.val;
import org.apache.commons.lang.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class DateUtils
{
	public static final String dateFormatStr = "yyyyMMdd";

	public static Date getToday(String format)
	{
		SimpleDateFormat dateformat = new SimpleDateFormat(format);
		try
		{
			return dateformat.parse(dateformat.format(new Date()));
		}
		catch (ParseException e)
		{
			e.printStackTrace();
			return null;
		}
	}

	public static String format(String format)
	{
		SimpleDateFormat dateformat = new SimpleDateFormat(format);
		return dateformat.format(new Date());
	}

	public static String format(Date date, String format)
	{
		String dateStr = "";
		SimpleDateFormat dateformat = new SimpleDateFormat(format);
		if(date!=null){
			dateStr = dateformat.format(date);
		}

		return dateStr;
	}
	public static String dateStr4(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String str = format.format(date);
		return str;
	}

	/**
	 * 找出时间所用的时间格式
	 *
	 * @author 徐韶兵
	 * @param dateStr
	 *            时间字符串类型
	 * @param formats
	 *            多个格式找出其中符合标准的格式
	 * @return
	 * @since JDK 1.7
	 */
	public static String getFormat(String dateStr, String... formats)
	{
		// 参数非空判断
		if (StringUtils.isBlank(dateStr) || null == formats)
		{
			return null;
		}
		// 看看时间在哪个格式
		for (String format : formats)
		{
			// 格式非空判断
			if (StringUtils.isBlank(format))
			{
				return null;
			}

			// 时间格式校验，报错说明格式存在问题
			SimpleDateFormat dateformat = new SimpleDateFormat(format);
			try
			{
				dateformat.parse(dateStr);
			}
			catch (ParseException e)
			{
				continue;
			}
			// 格式化没报错，还需要判断格式和时间长度是否相等，不相等，
			// 说明出现了"2015-01-01"被"yyyy"格式化成功的特例，继续校验其格式
			if (format.length() == dateStr.length())
			{
				return format;
			}
		}
		return null;
	}

	public static Date getDate(String dateStr, String format)
	{
		SimpleDateFormat dateformat = new SimpleDateFormat(format);
		try
		{
			return dateformat.parse(dateStr);
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 根据开始时间和结束时间获取该时间段的所有时间
	 *
	 * @author xushaobing
	 * @param startTime
	 *            开始时间
	 * @param endTime
	 *            结束时间
	 * @return 开始时间和结束时间获取该时间段的所有时间
	 * @since JDK 1.7
	 */
	public static List<String> getDateList(String startTime, String endTime)
	{
		// 获取开始时间的格式
		String formatS = DateUtils.getFormat(startTime, "yyyy", "yyyy-MM",
				"yyyy-MM-dd");
		// 获取结束时间分格式
		String formatE = DateUtils.getFormat(endTime, "yyyy", "yyyy-MM",
				"yyyy-MM-dd");
		// 开始时间的格式和结束时间的格式必须非空，并且相同
		if (StringUtils.isBlank(formatS) || StringUtils.isBlank(formatE)
				|| !formatS.equals(formatE))
		{
			return null;
		}
		//
		String format = formatS;
		// 年的格式取区间值
		if ("yyyy".equals(format))
		{
			List<String> dateList = new ArrayList<String>();
			for (int i = Integer.parseInt(startTime); i < Integer
					.parseInt(endTime); i++)
			{
				dateList.add(String.valueOf(i));
			}
			return dateList;
		}
		// 格式为空，则直接返回空
		else if (StringUtils.isBlank(format))
		{
			return null;
		}

		Date startDate = DateUtils.getDate(startTime, format);
		Date endDate = DateUtils.getDate(endTime, format);
		List<String> dateList = new ArrayList<String>();
		Calendar cs = Calendar.getInstance();
		cs.setTime(startDate);
		Calendar ce = Calendar.getInstance();
		ce.setTime(endDate);
		while (cs.getTimeInMillis() <= ce.getTimeInMillis())
		{
			dateList.add(DateUtils.format(cs.getTime(), format));
			// 开始时间月份加1
			if ("yyyy-MM".equals(format))
			{
				cs.add(Calendar.MONTH, 1);
			}
			// 开始时间天加1
			else if ("yyyy-MM-dd".equals(format))
			{
				cs.add(Calendar.DAY_OF_YEAR, 1);
			}
			else
			{
				break;
			}
		}
		return dateList;
	}

	/**
	 * 获得指定月份上一年的同一月
	 *
	 * @param specifiedMonth
	 * @return
	 * @throws Exception
	 */
	public static String getSpecifiedMonthOfYearBefore(String specifiedMonth)
	{// 可以用new Date().toLocalString()传递参数
		Calendar c = Calendar.getInstance();
		Date date = null;
		try
		{
			date = new SimpleDateFormat("yy-MM").parse(specifiedMonth);
		}
		catch (ParseException e)
		{
			e.printStackTrace();
		}
		if(date==null){
			return null;
		}
		c.setTime(date);
		int year = c.get(Calendar.YEAR);
		c.set(Calendar.YEAR, year - 1);

		String monthOfYearBefore = new SimpleDateFormat("yyyy-MM").format(c
				.getTime());
		return monthOfYearBefore;
	}

	/**
	 * 获得指定日期的上一月
	 *
	 * @param specifiedMonth
	 * @return
	 * @throws Exception
	 */
	public static String getSpecifiedMonthBefore(String specifiedMonth)
	{// 可以用new Date().toLocalString()传递参数
		Calendar c = Calendar.getInstance();
		Date date = null;
		try
		{
			date = new SimpleDateFormat("yy-MM").parse(specifiedMonth);
		}
		catch (ParseException e)
		{
			e.printStackTrace();
		}
		if(date==null){
			return null;
		}
		c.setTime(date);
		int month = c.get(Calendar.MONTH);
		c.set(Calendar.MONTH, month - 1);

		String monthBefore = new SimpleDateFormat("yyyy-MM")
				.format(c.getTime());
		return monthBefore;
	}

	/**
	 * 获得指定日期的前一天
	 *
	 * @param specifiedDay
	 * @return
	 * @throws Exception
	 */
	public static String getSpecifiedDayBefore(String specifiedDay)
	{// 可以用new Date().toLocalString()传递参数
		Calendar c = Calendar.getInstance();
		Date date = null;
		try
		{
			date = new SimpleDateFormat("yy-MM-dd").parse(specifiedDay);
		}
		catch (ParseException e)
		{
			e.printStackTrace();
		}
		if(date==null){
			return null;
		}
		c.setTime(date);
		int day = c.get(Calendar.DATE);
		c.set(Calendar.DATE, day - 1);

		String dayBefore = new SimpleDateFormat("yyyy-MM-dd").format(c
				.getTime());
		return dayBefore;
	}

	/**
	 * 获得指定日期的后一天
	 *
	 * @param specifiedDay
	 * @return
	 */
	public static String getSpecifiedDayAfter(String specifiedDay)
	{
		Calendar c = Calendar.getInstance();
		Date date = null;
		try
		{
			date = new SimpleDateFormat("yy-MM-dd").parse(specifiedDay);
		}
		catch (ParseException e)
		{
			e.printStackTrace();
		}
		if(date==null){
			return null;
		}
		c.setTime(date);
		int day = c.get(Calendar.DATE);
		c.set(Calendar.DATE, day + 1);

		String dayAfter = new SimpleDateFormat("yyyy-MM-dd")
				.format(c.getTime());
		return dayAfter;
	}

    /**
     * 时间大于当前时间-1m
     *
     * @param newEffectTime 新增记录失效时间
     */
    public static boolean isAfterNow(Date newEffectTime) {
		if (newEffectTime.after(getDate1MAgo())) {
			return true;
		}
		return false;
	}

	public static Date getStartOfToDate() {
		val now = Calendar.getInstance();
		now.set(Calendar.HOUR_OF_DAY, 0);
		now.clear(Calendar.MINUTE);
		now.clear(Calendar.SECOND);
		now.clear(Calendar.MILLISECOND);
		return now.getTime();
	}

	public static Date getDate1MAgo() {
		val now = Calendar.getInstance();
		now.clear(Calendar.MINUTE);
		now.add(Calendar.MINUTE, -2);
		return now.getTime();
	}

	public static boolean compareWithSecondPrecision(Date newEffectTime, Date lastEffectTime) {
		long lastTime = lastEffectTime.getTime() / 1000;
		long newTime = newEffectTime.getTime() / 1000;
		return lastTime == newTime;
	}

	public static Date nextDate(Date date) {
		val cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, 1);
		cal.clear(Calendar.HOUR);
		cal.clear(Calendar.MINUTE);
		cal.clear(Calendar.SECOND);
		cal.clear(Calendar.MILLISECOND);
		return cal.getTime();
	}
}