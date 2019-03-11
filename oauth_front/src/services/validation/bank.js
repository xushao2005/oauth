import request from "../../utils/request"
import {bankApi} from "../../constants/api"

export const uniqueName = async params => request(
	bankApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueId = async params => request(
	bankApi.uniqueId, {
		method: "get",
		data: params
	}
)
