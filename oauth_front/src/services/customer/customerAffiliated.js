import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerAffiliatedApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerAffiliatedApi.get).stringify(params), {
		method: "get",
		data: params.query
	})

export const create = async params => request(
	customerAffiliatedApi.create, {
		method: "post",
		data: params
	})

// 检测所属公司是否交叉
export const conflicted = async params => request(
	customerAffiliatedApi.conflicted, {
		method: "get",
		data: params
	})

// 检测生效时间是否交叉
export const conflictedActiveTime = async params => request(
	customerAffiliatedApi.conflictedActiveTime, {
		method: "get",
		data: params
	})
