package com.cmhb.api;

import lombok.Data;
import net.sf.oval.constraint.MemberOf;
import net.sf.oval.constraint.NotNull;

/**
 * Created by not3 on 17.6.1.
 */
@Data
public class RequestWrapper {
	private String id;
	@NotNull(message = "时序不能为空")
	private Long version;
	@NotNull(message = "操作类型不能为空")
	private String method;
	@NotNull(message = "业务类型不能为空")
	private String type;
	@MemberOf(value = {"A", "U"}, message = "未识别的业务操作类型")
	@NotNull(message = "业务编码不能为空")
	private Object businessCode;
	@NotNull(message = "业务数据不能为空")
	private Object body;
}
