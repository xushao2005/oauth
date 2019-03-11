import * as customerPlatformValidationService from "../../services/customer/customerPlatform"

export const checkUniquePlatformCode = async (rule, values, callback) => {
	if (!values.customerPlam || !values.plamCode) {
		callback()
	} else {
		const {data} = await customerPlatformValidationService.unique(values)
		if (data === false) {
			callback("该平台客户号已被绑定")
		} else {
			callback()
		}
	}
}
