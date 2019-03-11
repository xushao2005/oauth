import UrlPattern from "url-pattern"
import request from "../utils/request"
import {serviceApi} from "../constants/api"

export const query = async params => request(
	serviceApi.get, {
		method: "get",
		data: params
	})

export const view = async params => request(
	new UrlPattern(serviceApi.view).stringify(params), {
		method: "get"
	})

export const create = async params => request(
	serviceApi.create, {
		method: "post",
		data: params
	}
)

export const update = async params => request(
	serviceApi.update, {
		method: "put",
		data: params
	}
)

export const nextCode = async params => request(
	serviceApi.nextCode, {
		method: "get",
		data: params
	}
)
