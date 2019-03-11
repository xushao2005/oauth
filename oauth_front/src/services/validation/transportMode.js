import request from "../../utils/request"
import {transportModeApi} from "../../constants/api"

export const uniqueKey = async params => request(
	transportModeApi.uniqueKey, {
		method: "get",
		data: params
	}
)

export const uniqueValue = async params => request(
	transportModeApi.uniqueValue, {
		method: "get",
		data: params
	}
)
