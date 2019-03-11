import UrlPattern from "url-pattern"
import request from "../utils/request"
import {electricTypeApi} from "../constants/api"

export const query = async () => request(
	electricTypeApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	electricTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	electricTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(electricTypeApi.view).stringify(params), {
		method: "get"
	}
)
