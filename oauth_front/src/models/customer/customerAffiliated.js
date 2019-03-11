import * as customerAffiliatedService from "../../services/customer/customerAffiliated"

export default {
	namespace: "customerAffiliated",
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
			const {data} = yield call(customerAffiliatedService.query,
				{customerCode: payload.customerCode})
			yield put({
				type: "load",
				payload: {
					list: data
				}
			})
			yield put({
				type: "customerSettle/query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerAffiliatedService.create, payload)
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
