import request from "../../utils/request"
import {serviceApi} from "../../constants/api"

export const selection = async params => request(
	serviceApi.autoComplete, {
		method: "get",
		data: params
	})
