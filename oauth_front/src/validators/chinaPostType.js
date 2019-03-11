import * as chinaPostTypeValidationService from "../services/validation/chinaPostType"

export const checkUniqueId = async (rule, values, callback) => {
	if (!values.id) {
		callback()
	} else {
		const {data} = await chinaPostTypeValidationService.uniqueId(values)
		if (data === true) {
			callback("该中邮类型编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueName = async (rule, values, callback) => {
	if (!values.name) {
		callback()
	} else {
		const {data} = await chinaPostTypeValidationService.uniqueName(values)
		if (data === true) {
			callback("该中邮类型名称已被使用")
		} else {
			callback()
		}
	}
}
