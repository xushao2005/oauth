import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {platformCustomerApi, customerApi} from "../../constants/api"

export const queryPage = async params => request(
	platformCustomerApi.page, {
		method: "get",
		data: params
	})

export const platforms = async () => request(
	platformCustomerApi.platforms, {
		method: "get"
	})

export const searchByPhone = async params => request(
	new UrlPattern(customerApi.searchByPhone).stringify(params), {
		method: "get"
	}
)

export const associate = async params => request(
	new UrlPattern(platformCustomerApi.associate).stringify(params), {
		method: "post",
		data: params.ids
	})

export const associateDefaultCustomer = async params => request(
	platformCustomerApi.associateNewCustomer, {
		method: "post",
		data: [params]
	})
