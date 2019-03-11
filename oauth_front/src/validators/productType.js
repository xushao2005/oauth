import * as productTypeValidationService from "../services/validation/productType"

export const checkUniqueId = async (rule, values, callback) => {
	if (!values.id) {
		callback()
	} else {
		const {data} = await productTypeValidationService.uniqueId(values)
		if (data === true) {
			callback("该产品类型编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueName = async (rule, values, callback) => {
	if (!values.name) {
		callback()
	} else {
		const {data} = await productTypeValidationService.uniqueName(values)
		if (data === true) {
			callback("该产品类型名称已被使用")
		} else {
			callback()
		}
	}
}
