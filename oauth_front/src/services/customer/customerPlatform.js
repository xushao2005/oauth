import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerPlatformApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerPlatformApi.get).stringify(params), {
		method: "get",
		data: params.query
	})

export const create = async params => request(
	customerPlatformApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	customerPlatformApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(customerPlatformApi.remove).stringify(params), {
		method: "delete"
	})

export const unique = async params => request(
	customerPlatformApi.unique, {
		method: "get",
		data: params
	})
