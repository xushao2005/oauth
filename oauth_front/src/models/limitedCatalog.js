import * as limitedCatalog from "../services/limitedCatalog"

export default {
	namespace: "limitedCatalog",
	state: {
		list: []
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(limitedCatalog.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(limitedCatalog.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(limitedCatalog.create, payload)
			yield put({
				type: "query"
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dist/limited-catalog") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
