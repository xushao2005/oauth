import * as regionValidationService from "../services/validation/region"

export const checkUniqueId = async (rule, values, callback) => {
	if (!values.id) {
		callback()
	} else {
		const {data} = await regionValidationService.uniqueId(values)
		if (data === true) {
			callback("该国家编码已被使用")
		} else {
			callback()
		}
	}
}

export const checkUniqueCnName = async (rule, values, callback) => {
	if (!values.chineseName) {
		callback()
	} else {
		const {data} = await regionValidationService.uniqueCnName(values)
		if (data === true) {
			callback("该中文名称已被使用")
		} else {
			callback()
		}
	}
}

export const checkUniqueEnName = async (rule, values, callback) => {
	if (!values.englishName) {
		callback()
	} else {
		const {data} = await regionValidationService.uniqueEnName(values)
		if (data === true) {
			callback("该英文名称已被使用")
		} else {
			callback()
		}
	}
}
