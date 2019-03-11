import UrlPattern from "url-pattern"
import request from "../utils/request"
import {saleProductTypeApi} from "../constants/api"

export const query = async () => request(
	saleProductTypeApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	saleProductTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	saleProductTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(saleProductTypeApi.view).stringify(params), {
		method: "get"
	}
)

export const uniqueKey = async params => request(
	saleProductTypeApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	saleProductTypeApi.uniqueValue, {
		method: "get",
		data: params
	}
)
