import UrlPattern from "url-pattern"
import request from "../utils/request"
import {exchangeRateApi} from "../constants/api"

export const query = async params => request(
	exchangeRateApi.get, {
		method: "get",
		data: params
	}
)

export const update = async params => request(
	exchangeRateApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	exchangeRateApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(exchangeRateApi.view).stringify(params), {
		method: "get"
	}
)
