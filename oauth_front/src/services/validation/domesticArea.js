import request from "../../utils/request"
import {domesticAreaApi} from "../../constants/api"

export const uniqueName = async params => request(
	domesticAreaApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueId = async params => request(
	domesticAreaApi.uniqueCode, {
		method: "get",
		data: params
	}
)
