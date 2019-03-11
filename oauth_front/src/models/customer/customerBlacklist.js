import * as customerBlacklistService from "../../services/customer/customerBlacklist"

export default {
	namespace: "customerBlacklist",
	state: {
		list: [],
		current: {}
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveCurrent(state, {payload}) {
			const {current} = payload
			return {
				...state,
				current
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const {data} = yield call(customerBlacklistService.query,
				{customerCode: payload.customerCode})
			yield put({
				type: "load",
				payload: {
					list: data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerBlacklistService.create, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(customerBlacklistService.update, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* view({payload}, {call, put}) {
			const {data} = yield call(customerBlacklistService.view, {id: payload.p})
			yield put({
				type: "saveCurrent",
				payload: {
					current: data
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(customerBlacklistService.remove, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
	},
	subscriptions: {}
}
