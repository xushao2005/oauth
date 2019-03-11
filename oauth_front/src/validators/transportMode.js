import * as transportModeValidationService from "../services/validation/transportMode"

export const checkUniqueKey = async (rule, values, callback) => {
	if (!values.ikey) {
		callback()
	} else {
		const {data} = await transportModeValidationService.uniqueKey(values)
		if (data === false) {
			callback("该运输方式编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueValue = async (rule, values, callback) => {
	if (!values.value) {
		callback()
	} else {
		const {data} = await transportModeValidationService.uniqueValue(values)
		if (data === false) {
			callback("该运输方式名称已被使用")
		} else {
			callback()
		}
	}
}
