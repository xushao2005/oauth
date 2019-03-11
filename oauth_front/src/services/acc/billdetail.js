import request from "../../utils/request"
import {accApi} from "../../constants/api"

export const query = async params => request(
	accApi.billdetails, {
		method: "get",
		data: params
	})

export const exp = async params => request(
	accApi.billdetailExp, {
		method: "get",
		data: params
	})
