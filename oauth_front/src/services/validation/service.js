import request from "../../utils/request"
import {serviceApi} from "../../constants/api"

export const uniqueCode = async params => request(
	serviceApi.uniqueCode, {
		method: "get",
		data: params
	}
)

export const uniqueName = async params => request(
	serviceApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueSuppliercode = async params => request(
	serviceApi.uniqueSuppliercode, {
		method: "get",
		data: params
	}
)
