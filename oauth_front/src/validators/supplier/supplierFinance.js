import * as supplierFinanceValidationService from "../../services/supplier/supplierFinance"

export const checkUniqueAccountNumber = async (rule, values, callback) => {
	if (!values.id) {
		callback()
	} else {
		const {data} = await supplierFinanceValidationService.uniqueAccountNumber(values)
		if (data === true) {
			callback("该银行帐号已被使用")
		} else {
			callback()
		}
	}
}
