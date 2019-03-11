import UrlPattern from "url-pattern"
import request from "../utils/request"
import {productTypeApi} from "../constants/api"

export const query = async () => request(
	productTypeApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	productTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	productTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(productTypeApi.view).stringify(params), {
		method: "get"
	}
)
