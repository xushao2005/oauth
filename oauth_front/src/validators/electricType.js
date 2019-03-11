import * as electricTypeValidationService from "../services/validation/electricType"

export const checkUniqueId = async (rule, values, callback) => {
	if (!values.id) {
		callback()
	} else {
		const {data} = await electricTypeValidationService.uniqueId(values)
		if (data === true) {
			callback("该带电类型编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueName = async (rule, values, callback) => {
	if (!values.name) {
		callback()
	} else {
		const {data} = await electricTypeValidationService.uniqueName(values)
		if (data === true) {
			callback("该带电类型名称已被使用")
		} else {
			callback()
		}
	}
}
