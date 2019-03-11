
const PREFIX = "admin_"
export const storage = {
	setCookie(key, value, iDay) {
		const oDate = new Date()
		oDate.setDate(oDate.getDate() + iDay)
		document.cookie = `${PREFIX}${key}=${value};expires=${oDate}`
	},
	getCookie(key) {
		const cookieArr = document.cookie.split(";")
		for (let i = 0; i < cookieArr.length; i += 1) {
			const arr = cookieArr[i].split("=")
			if (arr[0].trim() === `${PREFIX}${key}`) {
				return arr[1]
			}
		}
		return false
	},
	removeCookie(key) {
		storage.setCookie(key, "", -1) // 只需要把Cookie保质期退回一天便可以删除
	}
}
