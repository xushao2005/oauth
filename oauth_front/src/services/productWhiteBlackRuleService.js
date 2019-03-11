import UrlPattern from "url-pattern"
import request from "../utils/request"
import {productApi} from "../constants/api"

export const query = async params => request(
	new UrlPattern(productApi.whiteBlackRule).stringify(params), {
		method: "get"
	}
)

export const create = async params => request(
	productApi.whiteBlackRuleCreate, {
		method: "post",
		data: params
	}
)

export const update = async params => request(
	productApi.whiteBlackRuleUpdate, {
		method: "put",
		data: params
	}
)

export const remove = async params => request(
	new UrlPattern(productApi.whiteBlackRuleDelete).stringify(params), {
		method: "delete"
	}
)

export const exportCustomer = async params => request(
	productApi.exportCustomer, {
		method: "get",
		data: params
	}
)

