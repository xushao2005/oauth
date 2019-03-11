import * as paymentCompanyValidationService from "../services/validation/paymentCompany"

export const checkUniqueKey = async (rule, values, callback) => {
	if (!values.id) {
		callback()
	} else {
		const {data} = await paymentCompanyValidationService.uniqueId(values)
		if (data === false) {
			callback("该编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueValue = async (rule, values, callback) => {
	if (!values.name) {
		callback()
	} else {
		const {data} = await paymentCompanyValidationService.uniqueName(values)
		if (data === false) {
			callback("该名称已被使用")
		} else {
			callback()
		}
	}
}
