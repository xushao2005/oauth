import * as serviceValidationService from "../services/validation/service"
import * as supplierValidationService from "../services/supplier/supplier"

export const checkCode = async (rule, values, callback) => {
	if (!values.code || !values.serviceUnitId) {
		callback()
	} else {
		const {data} = await serviceValidationService.uniqueCode(values)
		if (data === false) {
			callback("该服务编码已被占用")
		} else {
			callback()
		}
	}
}

export const checkName = async (rule, values, callback) => {
	if (!values.name) {
		callback()
	} else {
		const {data} = await serviceValidationService.uniqueName(values)
		if (data === false) {
			callback("该服务名称已被占用")
		} else {
			callback()
		}
	}
}

// 返回true，说明存在该供应商
export const checkSuppliercode = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await supplierValidationService.uniqueCode(values)
		if (data === true) {
			callback()
		} else {
			callback("请从下拉框中选择供应商")
		}
	}
}

