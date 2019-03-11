import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierFinanceApi} from "../../constants/api"

export const query = async params => request(
	supplierFinanceApi.finances, {
		method: "get",
		data: params
	})

export const create = async params => request(
	supplierFinanceApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierFinanceApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(supplierFinanceApi.remove).stringify(params), {
		method: "delete"
	})

export const view = async params => request(
	new UrlPattern(supplierFinanceApi.view).stringify(params), {
		method: "get"
	})

export const uniqueAccountNumber = async params => request(
	supplierFinanceApi.uniqueAccountNumber, {
		method: "get",
		data: params
	})
