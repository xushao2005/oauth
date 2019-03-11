import * as customerSettleService from "../../services/customer/customerSettle"

export default {
	namespace: "customerSettle",
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
			const {data} = yield call(customerSettleService.query,
				{customerCode: payload.customerCode})
			yield put({
				type: "load",
				payload: {
					list: data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerSettleService.create, payload)
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
