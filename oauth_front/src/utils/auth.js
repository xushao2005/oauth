import pathToRegexp from "path-to-regexp"

export const elementAuth = (location, elementName, menus) => {
	let currentMenu
	for (const menu of menus.filter(it => it.type === "menu")) {
		// 取得当前页面所在菜单

		if (menu.matchRouter && pathToRegexp(menu.matchRouter).exec(location.pathname)) {
			currentMenu = menu
			break
		}
		if (!currentMenu && menu.router) {
			const indexOfQuesion = menu.router.indexOf("?")
			const router = indexOfQuesion > -1 ? menu.router.substring(0, indexOfQuesion) : menu.router
			if (router === location.pathname) {
				currentMenu = menu
				break
			}
		}
	}
	if (currentMenu) {
		for (const element of menus.filter(it => it.type !== "menu" && it.bpid === currentMenu.id)) {
			// 判断是否权限有该名称的按钮或链接
			if (element.name === elementName) {
				return true
			}
		}
	}
	return false
}
