import {patterns} from "../utils/form"

export const checkCascaderAddress = async (rule, value, callback) => {
	if (value && !patterns.address.test(value.streetAddress)) {
		callback("请输入正确的街道地址(地址不包括特殊符号)")
	} else if (value && !patterns.notStartWithDigit.test(value.streetAddress)) {
		callback("街道首字符不能为数字")
	} else {
		callback()
	}
}
