import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerContactApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerContactApi.get).stringify(params), {
		method: "get"
	})

export const update = async params => request(
	customerContactApi.update, {
		method: "put",
		data: params
	})

export const create = async params => request(
	customerContactApi.create, {
		method: "post",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(customerContactApi.remove).stringify(params), {
		method: "delete"
	})

export const setDefault = async params => request(
	new UrlPattern(customerContactApi.setDefault).stringify(params), {
		method: "put"
	})
