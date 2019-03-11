import UrlPattern from "url-pattern"
import request from "../utils/request"
import {paymentCompanyApi} from "../constants/api"

export const query = async () => request(
	paymentCompanyApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	paymentCompanyApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	paymentCompanyApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(paymentCompanyApi.view).stringify(params), {
		method: "get"
	}
)
