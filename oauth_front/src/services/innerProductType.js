import UrlPattern from "url-pattern"
import request from "../utils/request"
import {innerProductTypeApi} from "../constants/api"

export const query = async () => request(
	innerProductTypeApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	innerProductTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	innerProductTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(innerProductTypeApi.view).stringify(params), {
		method: "get"
	}
)

export const uniqueKey = async params => request(
	innerProductTypeApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	innerProductTypeApi.uniqueValue, {
		method: "get",
		data: params
	}
)
