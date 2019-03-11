import lodash from "lodash"
import queryString from "query-string"
import * as userServie from "../services/auth/user"

export default {
	namespace: "app",
	state: {
		user: null,
		loggedIn: true,
		isSiderFold: false,
		isNavBar: document.body.clientWidth < 769
	},
	reducers: {
		switchSider(state) {
			return {
				...state,
				isSiderFold: !state.isSiderFold
			}
		},
		saveNavBarState(state, {payload}) {
			return {
				...state,
				isNavBar: payload
			}
		},
		saveUser(state, {payload}) {
			return {
				...state,
				user: payload
			}
		},
		saveLoggedIn(state) {
			if (state.loggedIn) {
				return {
					...state,
					loggedIn: false
				}
			} else {
				return state
			}
		}
	},
	effects: {
		* onResize(_, {put, select}) {
			const {app} = yield select(state => state)
			const isNavBar = document.body.clientWidth < 769
			if (isNavBar !== app.isNavBar) {
				yield put({type: "saveNavBarState", payload: isNavBar})
			}
		},
		* loadApp(_, { put, call}) {
			const result = yield call(userServie.current)
			const user = result.data
			if (user) {
				yield put({type: "resource/queryCurrentResources"})
			} else {
				window.location.href = "/api/oauth2/login"
			}
			yield put({type: "saveUser", payload: user})
		},
		* logout(_, {call, put}) {
			yield put({type: "saveUser", payload: null})
			const {data: result} = yield call(userServie.logout)
			// 退出重定向页面 由服务端控制
			if (result.success === true) {
				window.location.href = result.data
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "loadApp"})
			window.onresize = lodash.debounce(
				() => dispatch({type: "onResize"}), 300)
			// 全局注入 query
			history.listen((location) => {
				location.query = queryString.parse(location.search)
			})
		}
	}
}
