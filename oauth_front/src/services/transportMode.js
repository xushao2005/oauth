import UrlPattern from "url-pattern"
import request from "../utils/request"
import {transportModeApi} from "../constants/api"

export const query = async () => request(
	transportModeApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	transportModeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	transportModeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(transportModeApi.view).stringify(params), {
		method: "get"
	}
)

export const uniqueKey = async params => request(
	transportModeApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	transportModeApi.uniqueValue, {
		method: "get",
		data: params
	}
)
