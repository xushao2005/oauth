import request from "../../utils/request"
import {productGroupApi} from "../../constants/api"

export const uniqueKey = async params => request(
	productGroupApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	productGroupApi.uniqueValue, {
		method: "get",
		data: params
	}
)
