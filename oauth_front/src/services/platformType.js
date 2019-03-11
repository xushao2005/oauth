import UrlPattern from "url-pattern"
import request from "../utils/request"
import {platformTypeApi} from "../constants/api"

export const query = async params => request(
	platformTypeApi.get, {
		method: "get",
		data: params
	}
)

export const update = async params => request(
	platformTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	platformTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(platformTypeApi.view).stringify(params), {
		method: "get"
	}
)

export const codeExists = async params => request(
	platformTypeApi.codeExists, {
		method: "get",
		data: params
	}
)

export const nameExists = async params => request(
	platformTypeApi.nameExists, {
		method: "get",
		data: params
	}
)
