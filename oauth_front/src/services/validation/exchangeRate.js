import request from "../../utils/request"
import {exchangeRateApi} from "../../constants/api"

export const conflictedActiveTime = async params => request(
	exchangeRateApi.conflictedActiveTime, {
		method: "get",
		data: params
	}
)
