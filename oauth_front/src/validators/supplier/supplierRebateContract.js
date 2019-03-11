import * as supplierContractValidationService from "../../services/supplier/supplierRebateContract"

export const checkUniqueContractCode = async (rule, values, callback) => {
	if (!values.contractCode) {
		callback()
	} else {
		const {data} = await supplierContractValidationService.uniqueContractCode(values)
		if (data === true) {
			callback("相同合同号不能重复使用")
		} else {
			callback()
		}
	}
}

export const checkConflictedActiveTime = async (rule, values, callback) => {
	if (!values.supplierCode || !values.effectTime) {
		callback()
	} else {
		const {data} = await supplierContractValidationService.conflictedActiveTime(values)
		if (data === false) {
			callback("生效时间与前一合同冲突")
		} else {
			callback()
		}
	}
}
