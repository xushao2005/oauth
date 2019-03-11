import request from "../../utils/request"
import {productTypeApi} from "../../constants/api"

export const uniqueName = async params => request(
	productTypeApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueId = async params => request(
	productTypeApi.uniqueId, {
		method: "get",
		data: params
	}
)
