import request from "../../utils/request"
import {accApi} from "../../constants/api"

export const query = async params => request(
	accApi.transbills, {
		method: "get",
		data: params
	})

export const exp = async params => request(
	accApi.transbillExp, {
		method: "get",
		data: params
	})
