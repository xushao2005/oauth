import * as customerValidationService from "../../services/customer/customer"

export const checkUniqueNameCh = async (rule, values, callback) => {
	if (!values.customerName) {
		callback()
	} else {
		const {data} = await customerValidationService.uniqueNameCh(values)
		if (data === false) {
			callback("客户中文名已被使用")
		} else {
			callback()
		}
	}
}

// 检验 对账客服唯一性
export const checkCheckingCode = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await customerValidationService.checkCheckingCode(values)
		if (data === true) {
			callback()
		} else {
			callback("请从下拉框中选择对账客服")
		}
	}
}

// 检验 介绍人是否合法
export const checkIntroducerCode = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await customerValidationService.checkIntroducerCode(values)
		if (data === true) {
			callback()
		} else {
			callback("请从下拉框中选择介绍人")
		}
	}
}
