import UrlPattern from "url-pattern"
import request from "../utils/request"
import {chinaPostTypeApi} from "../constants/api"

export const query = async () => request(
	chinaPostTypeApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	chinaPostTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	chinaPostTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(chinaPostTypeApi.view).stringify(params), {
		method: "get"
	}
)
