import * as domesticAreaValidationService from "../services/validation/domesticArea"

export const checkUniqueId = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await domesticAreaValidationService.uniqueId(values)
		if (data === true) {
			callback("该国内区域编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueName = async (rule, values, callback) => {
	if (!values.name) {
		callback()
	} else {
		const {data} = await domesticAreaValidationService.uniqueName(values)
		if (data === true) {
			callback("该国内区域名称已被使用")
		} else {
			callback()
		}
	}
}
