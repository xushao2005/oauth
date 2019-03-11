import * as supplierValidationService from "../../services/supplier/supplier"

export const checkUniqueCode = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await supplierValidationService.uniqueCode(values)
		if (data === true) {
			callback("供应商编号已被使用")
		} else {
			callback()
		}
	}
}

export const checkUniqueNameCh = async (rule, values, callback) => {
	if (!values.nameCh) {
		callback()
	} else {
		const {data} = await supplierValidationService.uniqueNameCh(values)
		if (data === true) {
			callback("供应商中文名已被使用")
		} else {
			callback()
		}
	}
}

export const checkUniqueBusinessLicence = async (rule, values, callback) => {
	if (!values.businessLicence) {
		callback()
	} else {
		const {data} = await supplierValidationService.uniqueBusinessLicence(values)
		if (data === true) {
			callback("公司营业证件号已被使用")
		} else {
			callback()
		}
	}
}
