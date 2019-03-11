import request from "../../utils/request"
import {accApi} from "../../constants/api"

export const query = async params => request(
	accApi.custinfs, {
		method: "get",
		data: params
	})

export const exp = async params => request(
	accApi.custinfExp, {
		method: "get",
		data: params
	})
