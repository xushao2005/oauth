import * as customerSettleService from "../../services/customer/customerSettle"

// 检测结算公司
export const checkConflictedSettle = async (rule, values, callback) => {
	if (!values.settleCompany) {
		callback()
	} else {
		const {data} = await customerSettleService.conflicted(values)
		if (data === false) {
			callback("结算公司不能交叉")
		} else {
			callback()
		}
	}
}

// 检测生效时间
export const checkConflictedActiveTime = async (rule, values, callback) => {
	if (!values.effectTime) {
		callback()
	} else {
		const {data} = await customerSettleService.conflictedActiveTime(values)
		if (data === false) {
			callback("结算公司生效时间不能交叉")
		} else {
			callback()
		}
	}
}
