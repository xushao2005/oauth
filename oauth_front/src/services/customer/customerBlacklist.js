import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerBlacklistApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerBlacklistApi.get).stringify(params), {
		method: "get"
	}
)

export const view = async params => request(
	new UrlPattern(customerBlacklistApi.view).stringify(params), {
		method: "get"
	}
)

export const create = async params => request(
	customerBlacklistApi.create, {
		method: "post",
		data: params
	}
)

export const update = async params => request(
	customerBlacklistApi.update, {
		method: "put",
		data: params
	}
)

export const verifyProductCode = async params => request(
	customerBlacklistApi.verifyProductCode, {
		method: "get",
		data: params
	}
)

export const remove = async params => request(
	new UrlPattern(customerBlacklistApi.remove).stringify(params), {
		method: "delete"
	})
