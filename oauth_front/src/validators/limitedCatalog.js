import * as limitedCatalogValidationService from "../services/limitedCatalog"

export const checkUniqueKey = async (rule, values, callback) => {
	if (!values.ikey) {
		callback()
	} else {
		const {data} = await limitedCatalogValidationService.uniqueKey(values)
		if (data === false) {
			callback("该限制级类目编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueValue = async (rule, values, callback) => {
	if (!values.value) {
		callback()
	} else {
		const {data} = await limitedCatalogValidationService.uniqueValue(values)
		if (data === false) {
			callback("该限制级类目名称已被使用")
		} else {
			callback()
		}
	}
}
