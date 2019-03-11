import * as productValidationService from "../services/product"

export const checkUniqueCode = async (rule, values, callback) => {
	if (!values.productcode) {
		callback()
	} else {
		const {data} = await productValidationService.uniqueCode(values)
		if (data === true) {
			callback("该编码已被使用")
		} else {
			callback()
		}
	}
}

export const checkUniqueName = async (rule, values, callback) => {
	if (!values.productname) {
		callback()
	} else {
		const {data} = await productValidationService.uniqueName(values)
		if (data === true) {
			callback("该名称已被使用")
		} else {
			callback()
		}
	}
}
