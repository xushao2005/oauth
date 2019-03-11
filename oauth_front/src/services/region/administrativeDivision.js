import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {administrativeDivisionApi} from "../../constants/api"

export const getAll = async params => request(
	new UrlPattern(administrativeDivisionApi.getAll).stringify(params), {
		method: "get"
	})

export const create = async params => request(
	administrativeDivisionApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	administrativeDivisionApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(administrativeDivisionApi.remove).stringify(params), {
		method: "delete"
	})

export const ifNotExistAdministrativeCode = async params => request(
	administrativeDivisionApi.ifNotExistAdministrativeCode, {
		method: "get",
		data: params
	})

export const options = async params => request(
	administrativeDivisionApi.options, {
		method: "get",
		data: params
	}
)
