import lodash from "lodash"
import * as supplierTransportContractService from "../../services/supplier/supplierTransportContract"

export default {
	namespace: "supplierTransportContract",
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
			const data = yield call(supplierTransportContractService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierTransportContractService.create, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* update({payload}, {call, put}) {
			yield call(supplierTransportContractService.update, payload)
			yield put({
				type: "query",
				payload: {
					supplierCode: payload.supplierCode
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(supplierTransportContractService.remove, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		}
	},
	subscriptions: {}
}
