import * as customerValidationService from "../../services/customer/customerContract"

// 检测合同号是否重复
export const checkUniqueContractCode = async (rule, values, callback) => {
	if (!values.contractCode) {
		callback()
	} else {
		const {data} = await customerValidationService.uniqueContractCode(values)
		if (data === false) {
			callback("客户合同号重复")
		} else {
			callback()
		}
	}
}

// 检测合同生效时间是否合法
export const checkConflictedActiveTime = async (rule, values, callback) => {
	if (!values.customerCode || !values.effectTime) {
		callback()
	} else {
		const {data} = await customerValidationService.conflictedActiveTime(values)
		if (data === false) {
			callback("生效时间与前一合同冲突")
		} else {
			callback()
		}
	}
}
