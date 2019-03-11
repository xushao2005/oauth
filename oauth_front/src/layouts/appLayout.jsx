import React from "react"
import {connect} from "dva"
import NProgress from "nprogress"
import {Icon, Menu, Popover, Spin, Modal} from "antd"
import {Route, Switch} from "dva/router"
import Helmet from "react-helmet"
import classnames from "classnames"
import pathToRegexp from "path-to-regexp"
import {Bread, Menus, Sider, styles} from "../components/layouts/index"
import {footText, logo, name} from "../constants/app"
import NotFound from "../routes/index/404"
import Unauthorized from "../routes/index/505"
import {getAncestorKeysMap, getAncestorMenuKeys, makeTreeFromArray} from "../utils/menu"
import "../themes/index.less"
import "./appLayout.less"

let lastHref

const App = ({dispatch, location, app, navData, resource, loading}) => {
	const {currentResources, openedMenus} = resource
	const {user, isSiderFold, isNavBar, loggedIn} = app
	const pathname = location.pathname
	let currentMenu
	for (const item of currentResources) {
		if (item.matchRouter && pathToRegexp(item.matchRouter).exec(pathname)) {
			currentMenu = item
			break
		}
		if (!currentMenu && item.router) {
			const indexOfQuesion = item.router.indexOf("?")
			const router = indexOfQuesion > -1 ? item.router.substring(0, indexOfQuesion) : item.router
			if (router === location.pathname) {
				currentMenu = item
				break
			}
		}
	}
	navData.forEach((nav) => {
		for (const item of currentResources) {
			if (item.matchRouter && item.matchRouter === nav.path) {
				nav.auth = true
				break
			}
			if (item.router) {
				const indexOfQuesion = item.router.indexOf("?")
				const router
					= indexOfQuesion > -1 ? item.router.substring(0, indexOfQuesion) : item.router
				if (router === nav.path) {
					nav.auth = true
					break
				}
			}
		}
	})
	const menuTree = makeTreeFromArray(currentResources.filter(menuItem => menuItem.mpid !== -1), "id", "mpid")
	const ancestorKeysMap = getAncestorKeysMap(menuTree)
	const defaultSelectedKeys = getAncestorMenuKeys(currentResources, currentMenu)
	const href = window.location.href
	if (lastHref !== href) {
		NProgress.start()
		if (currentMenu) {
			// 是不是顶层菜单
			let isRootMenu = false
			for (const tree of menuTree) {
				if (tree.id === currentMenu.id) {
					isRootMenu = true
					break
				}
			}
			if (!isRootMenu && openedMenus.length === 0) {
				// 获得所有父菜单
				const getAncestorKeys = key => ancestorKeysMap[key] || []
				const parentId = currentMenu.mpid !== -1 ? currentMenu.mpid : currentMenu.bpid
				const currentOpenMenus = getAncestorKeys(parentId).concat(String(parentId))
				dispatch({type: "resource/saveOpenedMenus", payload: {openedMenus: currentOpenMenus}})
			}
		}
		if (!loading.global) {
			NProgress.done()
			lastHref = href
		}
	}
	const logout = () => {
		dispatch({
			type: "app/logout"
		})
	}
	const switchSider = () => {
		dispatch({type: "app/switchSider"})
	}
	const onMenuSelected = (e) => {
		if (e.key === "logout") {
			logout()
		}
	}
	const siderProps = {
		isSiderFold
	}
	const menusProps = {
		isSiderFold,
		menus: currentResources,
		menuTree,
		openedMenus,
		defaultSelectedKeys,
		ancestorKeysMap,
		currentMenu,
		onMenuOpenChange(openMenus) {
			dispatch({type: "resource/saveOpenedMenus", payload: {openedMenus: openMenus}})
		}
	}
	const breadProps = {
		menus: currentResources,
		currentMenu
	}
	return (
		<div>
			<Helmet>
				<title>{name}</title>
				<link rel="icon" href={logo} type="image/x-icon"/>
			</Helmet>
			{user && !loggedIn && Modal.warning({
				title: "请重新登陆",
				content: "登陆失效，请重新登陆..",
				onOk() {
					// console.log("OK")
				}
			})}
			<div className={classnames(styles.layout, {[styles.fold]: isNavBar ? false : isSiderFold},
				{[styles.withNavBar]: isNavBar})}>
				{!isNavBar && <aside className={classnames(styles.sider, styles.light, styles.dark)}>
					<Sider {...siderProps}>
						<Spin spinning={loading.effects["resource/queryCurrentResources"]}>
							{currentResources.length !== 0 && <Menus {...menusProps}/>}
						</Spin>
					</Sider>
				</aside>}
				<div className={styles.main}>
					<div className={styles.header}>
						<div className={classnames(styles.left, styles.topAdjust)}>
							{isNavBar
								?
								<Popover
									placement="bottomLeft"
									overlayClassName={styles.popOverMenu}
									trigger="click"
									content={currentResources.length !== 0 && <Menus {...menusProps}/>}>
									<div className={styles.button}><Icon type="bars"/></div>
								</Popover>
								:
								<div className={styles.button} onClick={switchSider}>
									<Icon type={isSiderFold ? "menu-unfold" : "menu-fold"}/>
								</div>}
						</div>
						<div className={classnames(styles.rightWrapper, styles.topAdjust)}>
							<div className={classnames(styles.button, styles.left)}>
								<Icon type="mail"/>
							</div>
							<Menu mode="horizontal" onClick={onMenuSelected}>
								<Menu.SubMenu title={<span><Icon type="user"/>{user && user.username}</span>}>
									<Menu.Item key="logout">登出</Menu.Item>
								</Menu.SubMenu>
							</Menu>
						</div>
					</div>
					{currentResources.length !== 0 && <Bread {...breadProps}/>}
					<div className={styles.container}>
						<div className={styles.content}>
							{user && currentResources.length > 0 && <Switch>
								{
									navData.map(item => (
										<Route
											exact
											key={item.path}
											path={item.path}
											component={item.auth ? item.component : Unauthorized}
										/>
									)
									)
								}
								<Route component={NotFound}/>
							</Switch>}
						</div>
					</div>
					<div className={styles.footer}>
						{footText}
					</div>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = ({app, resource, loading}) => ({app, resource, loading})

export default connect(mapStateToProps)(App)
