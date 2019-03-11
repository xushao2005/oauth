import request from "../../utils/request"
import {electricTypeApi} from "../../constants/api"

export const uniqueName = async params => request(
	electricTypeApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueId = async params => request(
	electricTypeApi.uniqueId, {
		method: "get",
		data: params
	}
)
