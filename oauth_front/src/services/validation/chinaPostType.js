import request from "../../utils/request"
import {chinaPostTypeApi} from "../../constants/api"

export const uniqueName = async params => request(
	chinaPostTypeApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueId = async params => request(
	chinaPostTypeApi.uniqueId, {
		method: "get",
		data: params
	}
)
