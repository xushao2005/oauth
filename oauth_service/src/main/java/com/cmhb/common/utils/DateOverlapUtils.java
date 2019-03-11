package com.cmhb.common.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 
 * （一句话功能简述） <br>
 * （日期区间重叠判断）
 * 
 * @author 李宏农
 * @version V1.0
 * @see [相关类/方法]
 * @since 2016年11月23日 下午6:51:35
 * 
 *        日期交叉情况判断：
start1 end1  start2 end2 

交集:
1、
start1--------end1
-------start2------end2 
条件：(start1<start2 || start1==start2) && (start2<end1 || start2==end1) && 
    (end1<end2 || end1==end2)
2、   
      start1------end1
start2-------end2 
条件：(start2<start1 || start2==start1) && (start1<end2 || start1==end2) && 
    (end2<end1 || end2==end1)

包含:
1、
start1------------------end1
        start2----end2 
条件：(start1<start2 || start1==start2) && (start2<end2 || start2==end2) && 
    (end2<end1 || end2==end1)
2、
        start1---end1
start2-----------------end2 
条件：(start2<start1 || start2==start1) && (start1<end1 || start1==end1) && 
    (end1<end2 || end1==end2)
 */
public class DateOverlapUtils
{
	private static final String DayStr = "yyyy-MM-dd";
	private static final String TimeStr = "yyyy-MM-dd HH:mm:ss";

	/**
	 * 
	 * isOverLap(这里用一句话描述这个方法的作用) <br>
	 * (Date类型（包含时分秒）日期区间比较)
	 * 
	 * @param start1
	 * @param end1
	 * @param start2
	 * @param end2
	 * @return
	 * @throws Exception
	 * @exception @since
	 *                2016年11月23日 下午7:15:40
	 * @author 李宏农
	 */
	public static boolean isOverLap(Date start1, Date end1, Date start2,
			Date end2) throws Exception
	{
		if (start1.after(end1))
		{
			throw new Exception("日期区间1不合法！");
		}

		if (start2.after(end2))
		{
			throw new Exception("日期区间2不合法！");
		}
		if ((start1.before(start2) || start1.equals(start2))
				&& (start2.before(end1) || start2.equals(end1))
				&& (end1.before(end2) || end1.equals(end2))) 
		{
			return true;
		}
		if ((start2.before(start1) || start2.equals(start1))
				&& (start1.before(end2) || start1.equals(end2))
			    && (end2.before(end1) || end2.equals(end1)))
		{
			return true;
		}
		if ((start1.before(start2) || start1.equals(start2))
				&& (start2.before(end2) || start2.equals(end2))
				&& (end2.before(end1) || end2.equals(end1)))
		{
			return true;
		}
		if ((start2.before(start1) || start2.equals(start1))
				&& (start1.before(end1) || start1.equals(end1))
				&& (end1.before(end2) || end1.equals(end2)))
		{
			return true;
		}
		return false;
	}

	/**
	 * 
	 * isOverLapForDay(这里用一句话描述这个方法的作用) <br>
	 * (Date类型（天，不包含时分秒）日期区间比较)
	 * 
	 * @param start1
	 * @param end1
	 * @param start2
	 * @param end2
	 * @return
	 * @throws Exception
	 * @exception @since
	 *                2016年11月23日 下午7:16:17
	 * @author 李宏农
	 */
	public static boolean isOverLapForDay(Date start1, Date end1, Date start2,
			Date end2) throws Exception
	{
		DateFormat DaySdf = new SimpleDateFormat(DayStr);
		start1 = DaySdf.parse(DaySdf.format(start1));
		start2 = DaySdf.parse(DaySdf.format(start2));
		end1 = DaySdf.parse(DaySdf.format(end1));
		end2 = DaySdf.parse(DaySdf.format(end2));
		DaySdf = null;
		return isOverLap(start1, end1, start2, end2);
	}

	/**
	 * 
	 * isOverLap(这里用一句话描述这个方法的作用) <br>
	 * (String类型（包含时分秒）日期区间比较)
	 * 
	 * @param start1
	 * @param end1
	 * @param start2
	 * @param end2
	 * @return
	 * @throws Exception
	 * @exception @since
	 *                2016年11月23日 下午7:16:44
	 * @author 李宏农
	 */
	public static boolean isOverLap(String start1, String end1, String start2,
			String end2) throws Exception
	{
		DateFormat TimeSdf = new SimpleDateFormat(TimeStr);
		Date s1 = TimeSdf.parse(start1);
		Date e1 = TimeSdf.parse(end1);
		Date s2 = TimeSdf.parse(start2);
		Date e2 = TimeSdf.parse(end2);
		TimeSdf = null;
		return isOverLap(s1, e1, s2, e2);
	}

	/**
	 * 
	 * isOverLapForDay(这里用一句话描述这个方法的作用) <br>
	 * (String类型（天，不包含时分秒）日期区间比较)
	 * 
	 * @param start1
	 * @param end1
	 * @param start2
	 * @param end2
	 * @return
	 * @throws Exception
	 * @exception @since
	 *                2016年11月23日 下午7:16:44
	 * @author 李宏农
	 */
	public static boolean isOverLapForDay(String start1, String end1,
			String start2, String end2) throws Exception
	{
		DateFormat DaySdf = new SimpleDateFormat(DayStr);
		Date s1 = DaySdf.parse(start1);
		Date e1 = DaySdf.parse(end1);
		Date s2 = DaySdf.parse(start2);
		Date e2 = DaySdf.parse(end2);
		DaySdf = null;
		return isOverLap(s1, e1, s2, e2);
	}

	public static void main(String[] args) throws Exception
	{
		boolean b1 = DateOverlapUtils.isOverLapForDay("2016-01-01", "2016-05-01",
				"2016-02-01", "2016-09-01");
		boolean b2 = DateOverlapUtils.isOverLapForDay("2016-01-01", "2016-05-01",
				"2015-02-01", "2016-03-01");
		boolean b3 = DateOverlapUtils.isOverLapForDay("2016-01-01", "2016-05-01",
				"2016-02-01", "2016-09-01");
		boolean b4 = DateOverlapUtils.isOverLapForDay("2016-03-01", "2016-05-01",
				"2015-02-01", "2016-07-01");
		boolean b5 = DateOverlapUtils.isOverLapForDay("2017-03-01", "2017-05-01",
				"2015-02-01", "2016-07-01");
		System.out.println(b1);
		System.out.println(b2);
		System.out.println(b3);
		System.out.println(b4);
		System.out.println(b5);
	}
}
