import UrlPattern from "url-pattern"
import request from "../utils/request"
import {limitedCatalogApi} from "../constants/api"

export const query = async () => request(
	limitedCatalogApi.get, {
		method: "get"
	}
)

export const update = async params => request(
	limitedCatalogApi.update, {
		method: "put",
		data: params
	}
)

export const create = async params => request(
	limitedCatalogApi.create, {
		method: "post",
		data: params
	}
)

export const view = async params => request(
	new UrlPattern(limitedCatalogApi.view).stringify(params), {
		method: "get"
	}
)

export const uniqueKey = async params => request(
	limitedCatalogApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	limitedCatalogApi.uniqueValue, {
		method: "get",
		data: params
	}
)
