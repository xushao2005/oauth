export const checkIdCard = (rule, value, callback, algorithm = " integrity") => {
	if (!value) {
		callback()
	} else if ((value.length !== 15) && (value.length !== 18)) {
		callback("身份证号码的长度不合法")
	} else {
		const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
		const stack = []
		for (let i = 0; i < value.length; i += 1) {
			stack[i] = value.charCodeAt(i)
			if ((stack[i] < "0".charCodeAt() || stack[i] > "9".charCodeAt()) && (i !== 17)) {
				callback("身份证号码的前17位必须是数字")
			} else if (i < 17) {
				stack[i] *= factors[i]
			}
		}
		// 检查年份和月份
		const date6 = value.substring(6, 12)
		const year = date6.substring(0, 4)
		const month = date6.substring(4, 6)
		if (year < 1700 || year > 2500) {
			callback("身份证号码出生年份不合法")
		}
		if (month < 1 || month > 12) {
			callback("身份证号码出生月份不合法")
		}
		if (algorithm === "simple") {
			// 身份验证简化版
			callback()
		}
		const parityBit = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]
		if ((value.length === 18)) {
			const day = value.substring(12, 14)
			const maxDayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
			if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
				maxDayOfMonth[1] = 29
			}
			if (day < 1 || day > maxDayOfMonth[month - 1]) {
				callback("身份证号码出生日期不合法")
			}
			let posOfParityBit = 0
			for (let i = 0; i < 17; i += 1) {
				posOfParityBit += stack[i]
			}
			// calculate the check digit
			const checkDigit = parityBit[posOfParityBit % 11]
			// check last digit
			if (stack[17] !== checkDigit) {
				callback("身份证号码最后一位校验码不正确")
			}
		}
		callback()
	}
}
