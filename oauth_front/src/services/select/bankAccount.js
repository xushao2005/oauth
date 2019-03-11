import request from "../../utils/request"
import {supplierSelectApi} from "../../constants/api"

export const selection = async params => request(
	supplierSelectApi.selection, {
		method: "get",
		data: params
	})
