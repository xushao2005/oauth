import * as customerContractService from "../../services/customer/customerContract"

export default {
	namespace: "customerContract",
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
		* query({payload}, {call, put}) {
			const data = yield call(customerContractService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data || []
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerContractService.create, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(customerContractService.update, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(customerContractService.remove, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		}
	},
	subscriptions: {}
}
