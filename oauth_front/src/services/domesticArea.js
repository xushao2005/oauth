import UrlPattern from "url-pattern"
import request from "../utils/request"
import {domesticAreaApi} from "../constants/api"

export const query = async () => request(
	domesticAreaApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	domesticAreaApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	domesticAreaApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(domesticAreaApi.view).stringify(params), {
		method: "get"
	}
)
