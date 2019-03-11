import lodash from "lodash"
import * as supplierRebateContractService from "../../services/supplier/supplierRebateContract"

export default {
	namespace: "supplierRebateContract",
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
			const data = yield call(supplierRebateContractService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierRebateContractService.create, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* update({payload}, {call, put}) {
			yield call(supplierRebateContractService.update, payload)
			yield put({
				type: "query",
				payload: {
					supplierCode: payload.supplierCode
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(supplierRebateContractService.remove, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		}
	},
	subscriptions: {}
}
