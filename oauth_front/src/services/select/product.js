import request from "../../utils/request"
import {productApi} from "../../constants/api"

export const selection = async params => request(
	productApi.autoComplete, {
		method: "get",
		data: params
	})
