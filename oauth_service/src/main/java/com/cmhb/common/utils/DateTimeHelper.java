package com.cmhb.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Class Description : DateTimeHelper is a class which used to support many kind
 * of date format string
 *
 * @author cf
 * @version 1.0 Dec 2, 2008
 */
public class DateTimeHelper {

    /**
     * 日期时间生产源
     *
     * @param format
     *
     * @return
     */
    public static String dateTime(String format) {
        Date date = null;
        SimpleDateFormat sdf = null;
        try {
            date = new Date();
            sdf = new SimpleDateFormat(format);
            return sdf.format(date);
        } catch (Exception e) {
            return null;
        } finally {
            date = null;
            sdf = null;
        }
    }

    /**
     * 获取年,如：2013
     *
     * @return
     */
    public static String getYear() {
        return dateTime("yyyy");
    }

    /**
     * 获取月,如：12
     *
     * @return
     */
    public static String getMonth() {
        return dateTime("MM");
    }

    /**
     * 获取日,如：22
     *
     * @return
     */
    public static String getDay() {
        return dateTime("dd");
    }

    /**
     * 获取几点,如：12:12
     *
     * @return
     */
    public static String getHourMin() {
        return dateTime("HH:mm");
    }

    /**
     * 获取时间,如：12:12:12
     *
     * @return
     */
    public static String getTime() {
        return dateTime("HH:mm:ss");
    }

    /**
     * 获取日期,如：2013-09-09
     *
     * @return
     */
    public static String getDate() {
        return dateTime("yyyy-MM-dd");
    }

    public static String getDate2() {
        return dateTime("yyyy/MM/dd");
    }

    /**
     * 获取日期,如：20130909
     *
     * @return
     */
    public static String getDateYYYYMMDD() {
        return dateTime("yyyyMMdd");
    }

    /**
     * 获取日期时间,如：2013-09-09 12:12:12
     *
     * @return
     */
    public static String getDateTime() {
        return dateTime("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 获取日期时间,如：2013-09-09 12:12:12
     *
     * @param date
     *
     * @return
     */
    public static String getDateTime(Date date) {
        SimpleDateFormat sdf = null;
        try {
            if (null != date) {
                sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                return sdf.format(date);
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        } finally {
            sdf = null;
        }
    }

    /**
     * 获取日期时间,如：2013-09-09 12:12:12
     *
     * @param date
     *
     * @return
     */
    public static String getDate(Date date) {
        SimpleDateFormat sdf = null;
        try {
            if (null != date) {
                sdf = new SimpleDateFormat("yyyy-MM-dd");
                return sdf.format(date);
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        } finally {
            sdf = null;
        }
    }

    /**
     * 获取无间隔日期时间,如：20130909121212
     *
     * @return
     */
    public static String getDateTimeNoGap() {
        return dateTime("yyyyMMddHHmmss");
    }

    /**
     * 获取无间隔日期时间,如：2013090912121211
     *
     * @return
     */
    public static String getDateTimeNoGapNoYear() {
        return dateTime("MMddHHmmss");
    }

    /**
     * 返回日期在一星期中的第几天，如星期日返回1，星期六返回7
     *
     * @param date
     *
     * @return
     */
    public static Integer getDayOfWeek(Date date) {
        Calendar cale = Calendar.getInstance();
        try {
            cale.setTime(date);
            cale.get(Calendar.DAY_OF_WEEK);
            return cale.get(Calendar.DAY_OF_WEEK);
        } catch (Exception e) {
            return null;
        } finally {
            cale = null;
        }

    }

    /**
     * 获取周的中文描述
     *
     * @param week
     *
     * @return
     */
    public static String getWeekName(Integer week) {
        switch (week) {
            case 1:
                return "周日";
            case 2:
                return "周一";
            case 3:
                return "周二";
            case 4:
                return "周三";
            case 5:
                return "周四";
            case 6:
                return "周五";
            case 7:
                return "周六";
        }
        return "";
    }

    /**
     * 与当前时间比较
     *
     * @param d
     *
     * @return
     */
    public static String getCompareBaseNow(String d) {
        Long l = null;
        Long day = null;
        Long hour = null;
        Long min = null;
        Long s = null;
        String rst = "";
        Date date = null;
        Date now = null;
        SimpleDateFormat df = null;
        try {
            df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            now = df.parse(DateTimeHelper.getDateTime());
            date = df.parse(d);
            l = now.getTime() - date.getTime();
            day = l / (24 * 60 * 60 * 1000);
            hour = (l / (60 * 60 * 1000) - day * 24);
            min = ((l / (60 * 1000)) - day * 24 * 60 - hour * 60);
            s = (l / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);

            if (day != 0) {

                if (day > 360) {
                    rst = "1年前";
                } else {
                    rst = day + "天前";
                }

                return rst;
            }

            if (hour != 0) {
                if (hour > 12) {// 大于12小时
                    rst = "1天前";
                } else {
                    rst = hour + "小时前";
                }
                return rst;
            }

            if (min != 0) {
                rst = min + "分钟前";

                return rst;
            }

            if (s != 0) {
                rst = s + "秒钟前";
                return rst;
            }

            if ("".equals(rst)) {
                rst = "1秒钟前";
                return rst;
            }
            return rst;
        } catch (Exception e) {
            return null;
        } finally {
            l = null;
            day = null;
            hour = null;
            min = null;
            s = null;
            rst = null;
            date = null;
            now = null;
            df = null;
        }
    }

    /**
     * 比较日期
     *
     * @param date1
     * @param date2
     *
     * @return
     */
    public static Boolean afterDate(String date1, String date2) {
        Date dateTemp1 = null;
        Date dateTemp2 = null;
        SimpleDateFormat format = null;
        Boolean flag = null;
        try {
            format = new SimpleDateFormat("yyyy-MM-dd");
            dateTemp1 = format.parse(date1);
            dateTemp2 = format.parse(date2);

            if (dateTemp1.after(dateTemp2)) {
                flag = true;
            } else {
                flag = false;
            }
        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            format = null;
            dateTemp1 = null;
            dateTemp2 = null;
        }
        return flag;
    }

    /**
     * 比较时间
     *
     * @param dateTime1
     * @param dateTime2
     *
     * @return
     */
    public static Boolean afterDateTime(String dateTime1, String dateTime2) {
        Date date1 = null;
        Date date2 = null;
        SimpleDateFormat format = null;
        Boolean flag = null;
        try {
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            date1 = format.parse(dateTime1);
            date2 = format.parse(dateTime2);
            if (date1.after(date2)) {
                flag = true;
            } else {
                flag = false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            date1 = null;
            date2 = null;
            format = null;
        }
        return flag;
    }

    /**
     * 比较时间
     *
     * @param dateTime1
     * @param dateTime2
     *
     * @return
     */
    public static Boolean afterDateTime2(String dateTime1, String dateTime2) {
        Date date1 = null;
        Date date2 = null;
        SimpleDateFormat format = null;
        Boolean flag = null;
        try {
            format = new SimpleDateFormat("yyyyMMddHHmmss");
            date1 = format.parse(dateTime1);
            date2 = format.parse(dateTime2);
            if (date1.after(date2)) {
                flag = true;
            } else {
                flag = false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            date1 = null;
            date2 = null;
            format = null;
        }
        return flag;
    }

    public static void main(String[] args) {
        // System.out.println(afterDateTime2("20150603111112" ,
        // "20150603111112"));
        System.out.println(System.currentTimeMillis());
    }

    /**
     * 获取间隔天数
     *
     * @param dateSt
     * @param dateEd
     *
     * @return
     */
    public static Long getDifferDays(String dateSt, String dateEd) {
        Date d1 = null;
        Date d2 = null;
        SimpleDateFormat df = null;
        try {
            df = new SimpleDateFormat("yyyy-MM-dd");
            d1 = df.parse(dateSt);
            d2 = df.parse(dateEd);
            return (d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000);
        } catch (Exception e) {
            return null;
        } finally {
            d1 = null;
            d2 = null;
            df = null;
        }
    }

    /**
     * 获取偏移日期
     *
     * @param dateTime
     * @param days
     *
     * @return
     */
    public static String getDateOffset(String dateTime, Integer days) {
        Long str2Time = null;
        Long str2TimeTemp = null;
        String rtDateTime = null;
        Date tempDate = new Date();
        SimpleDateFormat format = null;
        try {
            if (19 == dateTime.length()) {
                // 日期格式化成2007-06-16 00:00:00
                format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            } else {

                // 日期格式化成2007-06-16
                format = new SimpleDateFormat("yyyy-MM-dd");
            }

            // 将字符串日期格式化并专成时间
            str2Time = format.parse(dateTime).getTime() / 1000;

            // 加上指定天数，从当天算起
            str2TimeTemp = str2Time + 60 * 60 * 24 * days;

            // 将秒转成系统时钟频率，1000次大约是一秒，然后获得日期
            tempDate.setTime(str2TimeTemp * 1000);
            rtDateTime = format.format(tempDate);

            return rtDateTime;
        } catch (ParseException e) {
            return null;
        } finally {
            str2Time = null;
            str2TimeTemp = null;
            rtDateTime = null;
            tempDate = null;
            format = null;
        }

    }

    /**
     * 时间前推或后推分钟,其中JJ表示分钟.
     *
     * @param dt
     * @param mm
     *
     * @return
     */
    public static String getTimeOffset(String dt, Integer mm) {
        Long time = null;
        Date curDate = null;
        String reDate = null;
        SimpleDateFormat format = null;
        try {
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            curDate = format.parse(dt);

            time = (curDate.getTime() / 1000) + mm * 60;
            curDate.setTime(time * 1000);
            reDate = format.format(curDate);

            return reDate;
        } catch (Exception e) {
            return null;
        } finally {
            time = null;
            curDate = null;
            reDate = null;
            format = null;
        }
    }

    /**
     * 获取MM/DD格式日期
     *
     * @param date
     *
     * @return
     */
    public static String getMMDDFormat(String date) {
        String day = null;
        String month = null;
        try {
            day = date.substring(5, 7);
            month = date.substring(8, 10);
            return day + "/" + month;
        } catch (Exception e) {
            return null;
        } finally {
            day = null;
            month = null;
        }
    }

    /**
     * 获取时间戳
     *
     * @return
     */
    public static Long getTimestamp() {
        Date date = null;
        try {
            date = new Date();
            return date.getTime();
        } catch (Exception e) {
            return null;
        } finally {
            date = null;
        }
    }

    /**
     * 根据时间戳获取yyyy-MM-dd HH:mm:ss 时间
     *
     * @param timestamp
     *
     * @return
     */
    public static String getDateTime(Long timestamp) {
        return DateTimeHelper.getDateTime(new Date(timestamp));
    }

    /**
     * 根据字符串转成标准格式的日期
     *
     * @param str
     *
     * @return
     */
    public static Date getDateYYYYMMddhhmiss(String str) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = format.parse(str);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;

    }

    /**
     * 根据字符串转成标准格式的日期,解决字日期和小时连在一起的问题
     *
     * @param str
     *
     * @return
     */
    public static Date getDateddHH(String str) {
        SimpleDateFormat format = null;
        Date date = null;
        if (null != str && str.length() == 18) {
            format = new SimpleDateFormat("yyyy-MM-ddHH:mm:ss");
            try {
                date = format.parse(str);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        } else if (null != str && str.length() == 19) {
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            try {
                date = format.parse(str);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        return date;

    }
}
