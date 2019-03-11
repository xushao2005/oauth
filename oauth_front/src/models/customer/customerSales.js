import * as customerSalesService from "../../services/customer/customerSales"

export default {
	namespace: "customerSales",
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
			const data = yield call(customerSalesService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data || []
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerSalesService.create, payload)
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
