import request from "../../utils/request"
import {billPeriodApi} from "../../constants/api"

export const selection = async () => request(
	billPeriodApi.billPeriodSelection, {
		method: "get"
	})
