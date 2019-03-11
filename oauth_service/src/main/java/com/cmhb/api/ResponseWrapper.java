package com.cmhb.api;

import lombok.Data;

/**
 * Created by not3 on 17.4.12.
 */
@Data
public class ResponseWrapper {
	private boolean CallSucess = false;
	private String Message;
}
