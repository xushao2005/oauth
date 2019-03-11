import UrlPattern from "url-pattern"
import request from "../utils/request"
import {currencyApi} from "../constants/api"

export const query = async params => request(
	currencyApi.index, {
		method: "get",
		data: params
	}
)

export const update = async params => request(
	currencyApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	currencyApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(currencyApi.view).stringify(params), {
		method: "get"
	}
)

export const codeExists = async params => request(
	currencyApi.codeExists, {
		method: "get",
		data: params
	}
)
