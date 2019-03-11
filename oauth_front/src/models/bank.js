import * as bankService from "../services/bank"

export default {
	namespace: "bank",
	state: {
		list: [],
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
			const data = yield call(bankService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(bankService.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(bankService.create, payload)
			yield put({
				type: "query"
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/bank") {
					dispatch({
						type: "bank/query"
					})
				}
			})
		}
	}
}
