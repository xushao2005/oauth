export const handleReset = (form, option = {}) => {
	const {getFieldsValue, setFieldsValue} = form

	const fields = getFieldsValue()
	for (const item in fields) {
		if ({}.hasOwnProperty.call(fields, item)) {
			if ({}.hasOwnProperty.call(option, item)) {
				fields[item] = option[item]
			} else if (fields[item] instanceof Array) {
				fields[item] = []
			} else {
				fields[item] = undefined
			}
		}
	}
	setFieldsValue(fields)
}

export const handleResetFields = (form, option = {}) => {
	const {getFieldsValue, setFieldsValue} = form

	const fields = getFieldsValue()
	for (const item in option) {
		if ({}.hasOwnProperty.call(fields, item)) {
			fields[item] = option[item]
		}
	}
	setFieldsValue(fields)
}

export const forceValidateFields = (form) => {
	const {getFieldsValue, validateFields} = form

	const fields = getFieldsValue()
	for (const item in fields) {
		if ({}.hasOwnProperty.call(fields, item)) {
			if (fields[item] !== undefined) {
				validateFields([item], {force: true})
			}
		}
	}
}

export const hasValues = (form) => {
	const {getFieldsValue} = form

	const fields = getFieldsValue()
	for (const item in fields) {
		if ({}.hasOwnProperty.call(fields, item)) {
			if (fields[item] && fields[item].length > 0) {
				return true
			}
		}
	}
	return false
}

export const patterns = {
	// 只能包括中文字、英文字母、数字、括号和横线、下划线
	character: /^[()（）\u3400-\u9FFF\w-\s.,]+$/,
	// 只能包括英文字母、数字、括号和横线、下划线
	english: /^[()\w-\s]+$/,
	// 英文公司名只能包括英文字母、数字、括号和横线、下划线、逗号和句号
	englishCompanyName: /^[()\w-\s.,]+$/,
	// 验证地址
	address: /^[()\u00C0-\u031F\u3400-\u9FFF\w\s-#,./]+$/,
	// 首位不能为数字
	notStartWithDigit: /^(?!\d)+/,
	// 数字
	digit: /^\d+$/,
	// 首位不能为零的正整数
	positiveInteger: /^[1-9]+\d*$/,
	// 整数或小数
	decimal: /^(-)?[\d]+(\.[\d]+)?$/,
	// 手机号码验证
	mobile: /^1[0-9]{2}\d{8}$/,
	// 电子邮箱验证
	email: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
	// 电话号码验证
	telephone: /^\d{3,4}-?\d{7,9}(-\d{1,4})?$/,
	// 护照验证
	passport: /^(P\d{7}|G\d{8}|S\d{7,8}|D\d+|1[4,5]\d{7})$/,
	// 银行卡验证
	bankcard: /^\d{8,30}$/,
	// 邮政编码验证
	zipCode: /^\d{6}$/,
	// 统一社会信用码
	socialCreditNo: /^[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}$/
}
