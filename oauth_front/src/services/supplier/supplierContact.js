import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierContactApi} from "../../constants/api"

export const query = async params => request(
	supplierContactApi.contacts, {
		method: "get",
		data: params
	})

export const create = async params => request(
	supplierContactApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierContactApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(supplierContactApi.remove).stringify(params), {
		method: "delete"
	})

export const view = async params => request(
	new UrlPattern(supplierContactApi.view).stringify(params), {
		method: "get"
	})
