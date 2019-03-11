import * as employeeValidationService from "../services/validation/employee"

export const checkValidEmployee = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await employeeValidationService.checkValidEmployee(values)
		if (data === true) {
			callback()
		} else {
			callback("请从下拉框中选择员工")
		}
	}
}
