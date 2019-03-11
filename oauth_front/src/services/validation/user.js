import request from "../../utils/request"
import {userValidationApi} from "../../constants/api"

export const uniqueName = async params => request(
	userValidationApi.uniqueName, {
		method: "get",
		data: params
	})
