package com.cmhb.common.utils;

import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;


/**
 * 
 * （请求燕文接口工具类）
 * <br>（功能详细描述）
 * @author lougf
 * @version V1.0
 * @see [相关类/方法]
 * @since 2016年5月4日 上午10:03:21
 */
public class HttpBasicAuthorization
{
	private static Logger logger = Logger.getLogger(HttpBasicAuthorization.class);

	/**
	 * 
	 * RequsetFromUrl(这里用一句话描述这个方法的作用)
	 * <br>(这里描述这个方法适用条件 – 可选)
	 * @param urlstr 接口地址
	 * @param encoding  编码默认UTF-8
	 * @param xml  接口报文XML
	 * @param authorizationCode  认证信息
	 * @return
	 * @exception 
	 * @since 2016年5月4日 上午10:04:27
	 * @author lougf
	 */
	public static String RequsetFromUrl(String urlstr, String encoding,
			String xml, String authorizationCode) 
	{
		StringBuilder data = new StringBuilder();
		try
		{
			URL url = new URL(urlstr);
			if(null == encoding){
				encoding = "UTF-8";
			}
			HttpURLConnection connection = (HttpURLConnection) url
					.openConnection();
			if(null != authorizationCode){
				connection.setRequestProperty("Authorization",
						"Basic " + authorizationCode);
			}
			connection.setRequestProperty("User-Agent", "MSIE 7.0");

			if (null != xml)
			{
				connection.setUseCaches(false); // 不允许使用缓存
				connection.setRequestProperty("connection", "keep-alive");
				connection.setRequestProperty("Accept-Charset", encoding);
				connection.setRequestMethod("POST");
			}else{
			connection.setRequestMethod("GET");
				
			}
			connection.setConnectTimeout(10000);
			if (null != xml)
			{
				connection.setDoOutput(true);
				connection.setRequestProperty("Content-Type",
						"application/xml; charset=" + encoding);
				OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
						connection.getOutputStream(),encoding);
				outputStreamWriter.write(xml);
				outputStreamWriter.flush();

			}
			BufferedReader br = new BufferedReader(new InputStreamReader(
					connection.getInputStream(), encoding));
			String line = null;
			while ((line = br.readLine()) != null)
			{
				data.append(line);
			}
			connection.disconnect();
		}
		catch (Exception e)
		{
			logger.error(e.getMessage());
		}
		return data.toString();
	}



}
