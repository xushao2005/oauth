import * as currencyService from "../services/currency"
import * as supplierPayAccountService from "../services/supplier/supplierPayAccount"

export default {
	namespace: "currency",
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
			const data = yield call(currencyService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(currencyService.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(currencyService.create, payload)
			yield put({
				type: "query"
			})
		},
		* codeExists({payload}, {call}) {
			if (!payload.code) {
				return true
			}
			const {data: result} = yield call(currencyService.codeExists, payload)
			return !result
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/currencies") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
