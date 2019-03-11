import * as customerReceiverService from "../../services/customer/customerReceiver"

export default {
	namespace: "customerReceiver",
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
			const data = yield call(customerReceiverService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data || []
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerReceiverService.create, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
			yield put({
				type: "customer/view",
				payload: {
					customerCode: payload.customerCode
				}
			})
		}
	},
	subscriptions: {}
}
