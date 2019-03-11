import request from "../../utils/request"
import {accApi} from "../../constants/api"

export const query = async params => request(
	accApi.openbilldetails, {
		method: "get",
		data: params
	})

export const exp = async params => request(
	accApi.openbilldetailExp, {
		method: "get",
		data: params
	})
