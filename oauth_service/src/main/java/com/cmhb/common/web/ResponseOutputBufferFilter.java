package com.cmhb.common.web;

import org.apache.commons.lang.ClassUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

/**
 * 对http response 输出进行全缓冲,只有当输出流全部结束之后,才写回response
 * 
 */
public class ResponseOutputBufferFilter extends GenericFilterBean implements
		Filter {
	private static final Log logger = LogFactory
			.getLog(ResponseOutputBufferFilter.class);

	private static final String ThisTag = "_"
			+ ClassUtils.getShortClassName(ResponseOutputBufferFilter.class);

	private static final ThreadLocal<ByteArrayOutputStream> outputStreams = new ThreadLocal<ByteArrayOutputStream>();

	private final OutputReport report = new OutputReport();

	/**
	 * 输出流编码,缺省为utf-8
	 */
	private String outCharset = "UTF-8";

	/**
	 * 输出缓冲初始化大小
	 */
	private int outBufferSize = 1024 * 5;

	/**
	 * 防止内存泄露,回收ByteArrayOutputStream时保留的缓冲块数,也就是
	 * recyclingBufferBlockSize*outBufferSize=缓冲区初始化最大值
	 */
	private int recyclingBufferBlockSize = 2;

	public String getOutCharset() {
		return outCharset;
	}

	public void setOutCharset(String outCharset) {
		this.outCharset = outCharset;
	}

	public int getOutBufferSize() {
		return outBufferSize;
	}

	public void setOutBufferSize(int outBufferSize) {
		this.outBufferSize = outBufferSize;
	}

	public int getRecyclingBufferBlockSize() {
		return recyclingBufferBlockSize;
	}

	public void setRecyclingBufferBlockSize(int recyclingBufferBlockSize) {
		this.recyclingBufferBlockSize = recyclingBufferBlockSize;
	}

	public OutputReport getReport() {
		return report;
	}

	@Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain fc) throws IOException, ServletException {
		if (request.getAttribute(ThisTag) != null) {
			fc.doFilter(request, response);
			return;
		}
		request.setAttribute(ThisTag, ThisTag);
		final HttpServletResponse httpResponse = (HttpServletResponse) response;
		final OutoutWrapper out = new OutoutWrapper();
		HttpServletResponse httpResponseWrapper = new HttpServletResponseWrapper(
				httpResponse) {

			@Override
			public ServletOutputStream getOutputStream() throws IOException {
				return out.getServletOutputStream();
			}

			@Override
			public PrintWriter getWriter() throws IOException {
				return out.pw;
			}

			@Override
			public void flushBuffer() throws IOException {
			}

			@Override
			public int getBufferSize() {
				return Integer.MAX_VALUE;
			}

			@Override
			public void reset() {
				out.bos.reset();
				super.reset();
			}

			@Override
			public void resetBuffer() {
				out.bos.reset();
			}

			@Override
			public void setBufferSize(int size) {
			}
		};
		try {
			fc.doFilter(request, httpResponseWrapper);
		} finally {
			ServletOutputStream sos = httpResponse.getOutputStream();
			out.pw.flush();
			if (TimeProfiler.isProfileEnable()) {
				TimeProfiler
						.beginTask("write output to servlet outputstream with size:"
								+ out.bos.size() / 1024 + "KB.");
			}
			try {
				out.bos.writeTo(sos);
				sos.flush();
				report.output(out.bos.size());
			} finally {
				if (TimeProfiler.isProfileEnable()) {
					TimeProfiler.endTask();
				}
				out.reset();
			}
			request.removeAttribute(ThisTag);
		}
	}

	private final class OutoutWrapper {
		private ByteArrayOutputStream bos;

		private PrintWriter pw;

		public OutoutWrapper() throws IOException {
			super();
			this.bos = outputStreams.get();
			if (bos == null) {
				// this thread frist use
				this.bos = new ByteArrayOutputStream(outBufferSize);
				outputStreams.set(this.bos);
				if (logger.isDebugEnabled()) {
					logger.debug("init ByteArrayOutputStream with buffer size:"
							+ outBufferSize);
				}
			}
			this.pw = new PrintWriter(new OutputStreamWriter(bos, outCharset));
		}

		public void reset() {
			bos.reset(recyclingBufferBlockSize);
		}

		private ServletOutputStream getServletOutputStream() {
			return new ServletOutputStream() {
				@Override
				public void write(int b) throws IOException {
					bos.write(b);
				}

				@Override
				public void write(byte[] b, int off, int len)
						throws IOException {
					bos.write(b, off, len);
				}

				@Override
				public void write(byte[] b) throws IOException {
					bos.write(b);
				}

				@Override
				public void close() throws IOException {

				}

				@Override
				public void flush() throws IOException {

				}

				@Override
				public boolean isReady() {
					// TODO Auto-generated method stub
					return false;
				}

				@Override
				public void setWriteListener(WriteListener arg0) {
					// TODO Auto-generated method stub
					
				}

			};
		}
	}

	public static final class OutputReport {
		// 总输出大小
		private long outputTotal = 0;
		// 输出次数
		private long outputCount = 0;
		// 最大输出
		private int maxOutput = 0;

		private void output(int size) {
			outputTotal += size;
			outputCount++;
			maxOutput = Math.max(maxOutput, size);
		}

		/**
		 * 平均输出大小(KB)
		 */
		public long getAverageOutput() {
			return (outputTotal / outputCount) / 1024;
		}

		public long getOutputTotal() {
			return outputTotal / 1024;
		}

		public long getOutputCount() {
			return outputCount;
		}

		public int getMaxOutput() {
			return maxOutput / 1024;
		}
	}
}
