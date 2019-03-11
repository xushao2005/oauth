export const checkText = async (rule, values, callback) => {
	if (!values || !values.queryType || !values.queryText) {
		callback()
	} else {
		const {queryType, queryText} = values
		if (queryType === "customerCode") {
			if (/^(\d+\r*\n*)+$/.test(queryText)) {
				const codes = queryText.split("\n")
				if (codes && codes.length <= 500) {
					callback()
				} else {
					callback("客户号不能超过500个")
				}
			} else {
				callback("客户号只能为数字，并且用回车符分割")
			}
		} else if (queryType === "customerName") {
			const names = queryText.split("\n")
			if (names && names.length <= 500) {
				callback()
			} else {
				callback("客户名称不能超过500个")
			}
		} else {
			callback("无法识别的筛选条件")
		}
	}
}
