import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerImportJobApi} from "../../constants/api"

export const jobs = async params => request(
	customerImportJobApi.jobs, {
		method: "get",
		data: params
	}
)

export const items = async params => request(
	new UrlPattern(customerImportJobApi.items).stringify(params), {
		method: "get"
	}
)
