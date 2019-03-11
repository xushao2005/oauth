import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerPaymentApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerPaymentApi.get).stringify(params), {
		method: "get",
		data: params.query
	})

export const create = async params => request(
	customerPaymentApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	customerPaymentApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(customerPaymentApi.remove).stringify(params), {
		method: "delete"
	})

export const unitPaymentCard = async params => request(
	customerPaymentApi.unitPaymentCard, {
		method: "get",
		data: params
	}
)
