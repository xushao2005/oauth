import lodash from "lodash"
import * as supplierFinanceService from "../../services/supplier/supplierFinance"

export default {
	namespace: "supplierFinance",
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
			const data = yield call(supplierFinanceService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(supplierFinanceService.update, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierFinanceService.create, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* remove({payload}, {call, put}) {
			yield call(supplierFinanceService.remove, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		}
	},
	subscriptions: {}
}
