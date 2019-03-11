import * as productGroupValidationService from "../services/validation/productGroup"

export const checkUniqueKey = async (rule, values, callback) => {
	if (!values.ikey) {
		callback()
	} else {
		const {data} = await productGroupValidationService.uniqueKey(values)
		if (data === false) {
			callback("该产品组编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueValue = async (rule, values, callback) => {
	if (!values.value) {
		callback()
	} else {
		const {data} = await productGroupValidationService.uniqueValue(values)
		if (data === false) {
			callback("该产品组名称已被使用")
		} else {
			callback()
		}
	}
}
