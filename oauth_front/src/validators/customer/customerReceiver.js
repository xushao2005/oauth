import * as customerReceiverService from "../../services/customer/customerReceiver"

export const checkConflictedReceiver = async (rule, values, callback) => {
	if (!values.customerCode || !values.receiver) {
		callback()
	} else {
		const {data} = await customerReceiverService.conflicted(values)
		if (data === false) {
			callback("收款客服不能交叉")
		} else {
			callback()
		}
	}
}

// 检测生效时间是否合法
export const checkConflictedActiveTime = async (rule, values, callback) => {
	if (!values.customerCode || !values.effectTime) {
		callback()
	} else {
		const {data} = await customerReceiverService.conflictedActiveTime(values)
		if (data === false) {
			callback("生效时间与前一收款客服冲突")
		} else {
			callback()
		}
	}
}

// 检验 收款客服唯一性
export const checkReceiptCode = async (rule, values, callback) => {
	if (!values.code) {
		callback()
	} else {
		const {data} = await customerReceiverService.checkCode(values)
		if (data === true) {
			callback()
		} else {
			callback("请从下拉框中选择收款客服")
		}
	}
}
