export const checkBusinessLicense = (rule, value, callback) => {
	if (!value) {
		callback()
	} else if (/^\d{15}$/.test(value) || /^\d{17}[0-9xX]{1}$/.test(value)) {
		callback()
	} else {
		callback("请输入正确的营业执照注册号")
	}
}
