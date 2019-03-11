import lodash from "lodash"
import * as customerAffiliatedService from "../../services/customer/customerAffiliated"
import * as customerSettleService from "../../services/customer/customerSettle"

// 检测所属公司
export const checkConflictedAffiliated = async (rule, values, callback) => {
	if (!values.affiliatedCompany) {
		callback()
	} else {
		const {data} = await customerAffiliatedService.conflicted(values)
		if (data === false) {
			callback("所属公司不能交叉")
			return
		}
		callback()
	}
}

// 检测生效时间
export const checkConflictedActiveTime = async (rule, values, callback) => {
	if (!values.effectTime) {
		callback()
	} else {
		const {data} = await customerAffiliatedService.conflictedActiveTime(values)
		if (data === false) {
			callback("所属公司生效时间不能交叉")
			return
		}
		if (values.updateSettleCompany === true) {
			const {data: dataSettle} = await customerSettleService.conflictedActiveTime(values)
			if (dataSettle === false) {
				callback("结算公司生效时间不能交叉")
				return
			}
		}
		callback()
	}
}
