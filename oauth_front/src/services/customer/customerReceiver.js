import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerReceiverApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerReceiverApi.get).stringify(params), {
		method: "get",
		data: params.query
	})

// 检测是否交叉
export const conflicted = async params => request(
	customerReceiverApi.conflicted, {
		method: "get",
		data: params
	}
)

// 检测生效时间是否交叉
export const conflictedActiveTime = async params => request(
	customerReceiverApi.conflictedActiveTime, {
		method: "get",
		data: params
	}
)

export const create = async params => request(
	customerReceiverApi.create, {
		method: "post",
		data: params
	})

// 检测 唯一性
export const checkCode = async params => request(
	customerReceiverApi.uniqueCode, {
		method: "get",
		data: params
	}
)
