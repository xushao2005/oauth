import * as customerPaymentService from "../../services/customer/customerPayment"

export default {
	namespace: "customerPayment",
	state: {
		list: []
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list,
				currentId: list.length > 0 ? list[0].id : null
			}
		},
	},
	effects: {
		* query({payload}, {call, put}) {
			const {data} = yield call(customerPaymentService.query,
				{customerCode: payload.customerCode})
			yield put({
				type: "load",
				payload: {
					list: data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerPaymentService.create, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(customerPaymentService.update, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(customerPaymentService.remove, payload)
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
