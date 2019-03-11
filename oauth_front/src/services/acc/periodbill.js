import request from "../../utils/request"
import {accPeriodApi} from "../../constants/api"

export const query = async params => request(
	accPeriodApi.periodBills, {
		method: "get",
		data: params
	})

export const resend = async params => request(
	accPeriodApi.resend, {
		method: "get",
		data: params
	})

export const exp = async params => request(
	accPeriodApi.exp, {
		method: "get",
		data: params
	})
