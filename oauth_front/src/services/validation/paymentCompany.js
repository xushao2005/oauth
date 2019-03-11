import request from "../../utils/request"
import {paymentCompanyApi} from "../../constants/api"

export const uniqueName = async params => request(
	paymentCompanyApi.uniqueName, {
		method: "get",
		data: params
	}
)

export const uniqueId = async params => request(
	paymentCompanyApi.uniqueId, {
		method: "get",
		data: params
	}
)
