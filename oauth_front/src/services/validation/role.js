import request from "../../utils/request"
import {roleValidationApi} from "../../constants/api"

export const uniqueName = async params => request(
	roleValidationApi.uniqueName, {
		method: "get",
		data: params
	})
