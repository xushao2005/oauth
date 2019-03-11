import React from "react"
import {Menu, Icon} from "antd"
import {Link} from "dva/router"

const Menus = ({isSiderFold, menuTree, openedMenus, currentMenu, defaultSelectedKeys,
								 ancestorKeysMap, onMenuOpenChange}) => {
	// 递归生成菜单
	const generateMenus = menuTreeN => menuTreeN.map((item) => {
		// 是不是顶层菜单
		const isRootMenu = menuTree.indexOf(item) >= 0
		if (item.children) {
			return (
				<Menu.SubMenu
					key={item.id}
					title={<span>
						{item.icon && <Icon type={item.icon}/>}
						{(!isSiderFold || !isRootMenu) && item.name}
					</span>}
				>
					{generateMenus(item.children)}
				</Menu.SubMenu>
			)
		} else {
			return (
				<Menu.Item key={item.id}>
					{<Link
						to={item.router}
						replace={currentMenu && item.id === currentMenu.id}
					>
						{item.icon && <Icon type={item.icon}/>}
						{(!isSiderFold || !isRootMenu) && item.name}
					</Link>}
				</Menu.Item>
			)
		}
	})
	const menuItems = generateMenus(menuTree)
	// 获得所有父菜单
	const getAncestorKeys = key => ancestorKeysMap[key] || []
	// 保持打开状态
	const onOpenChange = (openMenus) => {
		const latestOpenMenu = openMenus.find(key => !(openedMenus.indexOf(key) > -1))
		const latestCloseMenu = openedMenus.find(key => !(openMenus.indexOf(key) > -1))
		let nextOpenMenus = []
		if (latestOpenMenu) {
			nextOpenMenus = getAncestorKeys(latestOpenMenu).concat(latestOpenMenu)
			onMenuOpenChange(nextOpenMenus)
		}
		if (!isSiderFold && latestCloseMenu) {
			nextOpenMenus = getAncestorKeys(latestCloseMenu)
			onMenuOpenChange(nextOpenMenus)
		}
	}
	const menusProps = isSiderFold ? {
		onOpenChange
	} : {
		onOpenChange,
		openKeys: openedMenus
	}
	return (
		<Menu
			{...menusProps}
			mode={isSiderFold ? "vertical" : "inline"}
			defaultSelectedKeys={defaultSelectedKeys}
			theme="dark"
		>
			{menuItems}
		</Menu>
	)
}

export default Menus
