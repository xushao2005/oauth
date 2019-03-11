import * as customerSalesValidationService from "../../services/customer/customerSales"

// 检测销售是否交叉
export const checkConflictedSales = async (rule, values, callback) => {
	if (!values.customerCode || !values.salesManager) {
		callback()
	} else {
		const {data} = await customerSalesValidationService.conflicted(values)
		if (data === false) {
			callback("销售经理不能交叉")
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
		const {data} = await customerSalesValidationService.conflictedActiveTime(values)
		if (data === false) {
			callback("生效时间与前一销售经理冲突")
		} else {
			callback()
		}
	}
}

// 检验 销售经理唯一性
export const checkSaleCode = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await customerSalesValidationService.checkCode(values)
		if (data === true) {
			callback()
		} else {
			callback("请从下拉框中选择销售经理")
		}
	}
}
