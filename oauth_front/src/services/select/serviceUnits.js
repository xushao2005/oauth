import request from "../../utils/request"
import {serviceUnitApi} from "../../constants/api"

export const selection = async params => request(
	serviceUnitApi.get, {
		method: "get",
		data: params
	})
