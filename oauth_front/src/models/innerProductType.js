import * as innerProductType from "../services/innerProductType"

export default {
	namespace: "innerProductType",
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
			const data = yield call(innerProductType.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(innerProductType.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(innerProductType.create, payload)
			yield put({
				type: "query"
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dist/inner-product-type") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
