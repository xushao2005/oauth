import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerSaleManagerApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerSaleManagerApi.get).stringify(params), {
		method: "get",
		data: params.query
	})

// 检测销售经理是否交叉
export const conflicted = async params => request(
	customerSaleManagerApi.conflicted, {
		method: "get",
		data: params
	}
)

// 检测销售经理生效时间是否交叉
export const conflictedActiveTime = async params => request(
	customerSaleManagerApi.conflictedActiveTime, {
		method: "get",
		data: params
	}
)

export const create = async params => request(
	customerSaleManagerApi.create, {
		method: "post",
		data: params
	})

export const checkCode = async params => request(
	customerSaleManagerApi.uniqueCode, {
		method: "get",
		data: params
	}
)
