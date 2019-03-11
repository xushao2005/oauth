import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierAccountOptionApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(supplierAccountOptionApi.query).stringify(params), {
		method: "get"
	})

export const create = async params => request(
	supplierAccountOptionApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierAccountOptionApi.update, {
		method: "put",
		data: params
	})

export const view = async params => request(
	new UrlPattern(supplierAccountOptionApi.view).stringify(params), {
		method: "get"
	})

export const remove = async params => request(
	new UrlPattern(supplierAccountOptionApi.remove).stringify(params), {
		method: "delete"
	})

export const codeExists = async params => request(
	supplierAccountOptionApi.codeExists, {
		method: "get",
		data: params
	}
)
