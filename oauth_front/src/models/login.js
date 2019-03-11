import * as userServie from "../services/auth/user"

export default {
	namespace: "login",
	state: {},
	reducers: {},
	effects: {
		* login({payload}, {call}) {
			try {
				yield call(userServie.login, payload)
				window.location.href = "/"
			} catch (e) {
				throw Error("用户名或者密码错误")
			}
		},
		* online(_, {select}) {
			const app = yield select(state => state.app)
			if (app.user !== undefined && app.user !== null) {
				window.location.href = "/"
			} else {
				window.location.href = "api/oauth2/login"
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/login") {
					dispatch({
						type: "online"
					})
				}
			})
		}
	}
}
