import * as customerValidationPayment from "../../services/customer/customerPayment"

// 检测合同号是否重复
export const checkUniquePayment = async (rule, values, callback) => {
	if (!values) {
		callback()
	} else {
		const {data} = await customerValidationPayment.unitPaymentCard(values)
		if (data === false) {
			callback("您已添加了该帐号，请输入其他帐号")
		} else {
			callback()
		}
	}
}
