import request from "../../utils/request"
import {supplierSelectApi} from "../../constants/api"

export const selection = async () => request(
	supplierSelectApi.supplierTypeSelection, {
		method: "get"
	})
