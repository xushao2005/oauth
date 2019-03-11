import * as saleProductTypeValidationService from "../services/saleProductType"

export const checkUniqueKey = async (rule, values, callback) => {
	if (!values.ikey) {
		callback()
	} else {
		const {data} = await saleProductTypeValidationService.uniqueKey(values)
		if (data === false) {
			callback("该销售产品类型编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkUniqueValue = async (rule, values, callback) => {
	if (!values.value) {
		callback()
	} else {
		const {data} = await saleProductTypeValidationService.uniqueValue(values)
		if (data === false) {
			callback("该销售产品类型名称已被使用")
		} else {
			callback()
		}
	}
}
