import UrlPattern from "url-pattern"
import request from "../utils/request"
import {productGroupApi} from "../constants/api"

export const query = async () => request(
	productGroupApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	productGroupApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	productGroupApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(productGroupApi.view).stringify(params), {
		method: "get"
	}
)

export const uniqueKey = async params => request(
	productGroupApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	productGroupApi.uniqueValue, {
		method: "get",
		data: params
	}
)
