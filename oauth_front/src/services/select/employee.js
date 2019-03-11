import request from "../../utils/request"
import {employeeApi} from "../../constants/api"

export const salesAutoComplete = async params => request(
	employeeApi.salesAutoComplete, {
		method: "get",
		data: params
	})

export const checksAutoComplete = async params => request(
	employeeApi.checksAutoComplete, {
		method: "get",
		data: params
	})

export const receiptsAutoComplete = async params => request(
	employeeApi.receiptsAutoComplete, {
		method: "get",
		data: params
	})

export const employeesAutoComplete = async params => request(
	employeeApi.employeesAutoComplete, {
		method: "get",
		data: params
	})

export const employeesAutoCompleteWithNoDuty = async params => request(
	employeeApi.employeesAutoCompleteWithNoDuty, {
		method: "get",
		data: params
	}
)

export const employeesInBranchCompanyAutoComplete = async params => request(
	employeeApi.employeesInBranchCompanyAutoComplete, {
		method: "get",
		data: params
	})
