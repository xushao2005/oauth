import UrlPattern from "url-pattern"
import request from "../utils/request"
import {chargeItemTypeApi} from "../constants/api"

export const query = async params => request(
	chargeItemTypeApi.get, {
		method: "get",
		data: params
	}
)

export const update = async params => request(
	chargeItemTypeApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	chargeItemTypeApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(chargeItemTypeApi.view).stringify(params), {
		method: "get"
	}
)

export const codeExists = async params => request(
	chargeItemTypeApi.codeExists, {
		method: "get",
		data: params
	}
)

export const nameExists = async params => request(
	chargeItemTypeApi.nameExists, {
		method: "get",
		data: params
	}
)
