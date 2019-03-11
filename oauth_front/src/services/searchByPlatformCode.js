import request from "../utils/request"
import {customerApi} from "../constants/api"

export const queryPage = async params => request(
	customerApi.searchByPlatform, {
		method: "get",
		data: params
	}
)
