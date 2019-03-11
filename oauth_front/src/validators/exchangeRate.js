import * as exchangeRateValidationService from "../services/validation/exchangeRate"

export const checkConflictedActiveTime = async (rule, values, callback) => {
	if (!values.originalCurrencyId || !values.targetCurrencyId || !values.newDate) {
		callback("源币种、目标币种、生效时间必填")
	} else {
		const {data} = await exchangeRateValidationService.conflictedActiveTime(values)
		if (data === false) {
			callback("汇率生效时间不能交叉")
		} else {
			callback()
		}
	}
}
