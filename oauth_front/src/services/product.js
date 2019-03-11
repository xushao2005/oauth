import UrlPattern from "url-pattern"
import request from "../utils/request"
import {productApi} from "../constants/api"

export const query = async params => request(
	productApi.get, {
		method: "get",
		data: params
	}
)

export const create = async params => request(
	productApi.create, {
		method: "post",
		data: params
	}
)

export const update = async params => request(
	productApi.update, {
		method: "put",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(productApi.view).stringify(params), {
		method: "get"
	})

export const nextCode = async () => request(
	productApi.nextCode, {
		method: "get"
	})

export const uniqueCode = async params => request(
	productApi.uniqueCode, {
		method: "get",
		data: params
	})

export const uniqueName = async params => request(
	productApi.uniqueName, {
		method: "get",
		data: params
	})

export const validCountryNames = async params => request(
	productApi.verifyCountryNames, {
		method: "get",
		data: params
	})

export const validCustomerNames = async params => request(
	productApi.verifyCustomerNames, {
		method: "get",
		data: params
	}
)
