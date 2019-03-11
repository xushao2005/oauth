package com.cmhb.module.auth.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class ControlModel implements Serializable {

	private static final long serialVersionUID = 1L;

	private long id;
	@JsonProperty(value = "mpid")
	private long controlPId;
	@JsonProperty(value = "bpid")
	private long breadPId;
	private String icon;
	private String name;
	private String router;
	@JsonProperty(value = "match_router")
	private String matchRouter;
	private String type;
	private int seq;

	public static class Comparator implements java.util.Comparator<ControlModel> {
		@Override
		public int compare(ControlModel control1, ControlModel control2) {
			if (control1.getSeq() == control2.getSeq()) {
				return control1.getId() > control2.getId() ? 1 : -1;
			}
			return control1.getSeq() > control2.getSeq() ? 1 : -1;
		}
	}
}
