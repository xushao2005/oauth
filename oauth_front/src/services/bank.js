import UrlPattern from "url-pattern"
import request from "../utils/request"
import {bankApi} from "../constants/api"

export const query = async () => request(
	bankApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	bankApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	bankApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(bankApi.view).stringify(params), {
		method: "get"
	}
)

export const selection = async () => request(
	bankApi.bankSelection, {
		method: "get"
	})
