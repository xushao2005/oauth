import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerConsignorApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerConsignorApi.get).stringify(params), {
		method: "get"
	})

export const update = async params => request(
	customerConsignorApi.update, {
		method: "put",
		data: params
	})

export const create = async params => request(
	customerConsignorApi.create, {
		method: "post",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(customerConsignorApi.remove).stringify(params), {
		method: "delete"
	})

export const verify = async params => request(
	customerConsignorApi.verify, {
		method: "get",
		data: params
	})

export const setDefault = async params => request(
	new UrlPattern(customerConsignorApi.setDefault).stringify(params), {
		method: "put"
	})
