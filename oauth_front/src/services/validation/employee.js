import request from "../../utils/request"
import {employeeApi} from "../../constants/api"

export const checkValidEmployee = async params => request(
	employeeApi.employeeValidationCode, {
		method: "get",
		data: params
	}
)
