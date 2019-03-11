import React from "react"
import {Route, Router, Switch} from "dva/router"
import {LocaleProvider, Spin} from "antd"
import dynamic from "dva/dynamic"
import {getNavData} from "./constants/nav"
import {styles} from "./components/layouts"

dynamic.setDefaultLoadingComponent(() => <Spin size="large" className={styles.globalSpin}/>)

const getLayout = (navData, layoutName) => {
	if (!navData.some(item => item.layoutName === layoutName) ||
		!(navData.filter(item => item.layoutName === layoutName)[0].children)) {
		return null
	}
	const route = navData.filter(item => item.layoutName === layoutName)[0]
	return {
		layout: route.layout,
		children: route.children
	}
}

const Routers = ({history, app}) => {
	const navData = getNavData(app)
	const appContainer = getLayout(navData, "AppLayout")
	const AppLayout = appContainer.layout
	return (
		<LocaleProvider>
			<Router history={history}>
				<Switch>
					<Route
						path="/"
						render={props =>
							(<AppLayout
								{...props}
								{...{navData: appContainer.children}}
							/>)
						}
					/>
				</Switch>
			</Router>
		</LocaleProvider>
	)
}

export default Routers
