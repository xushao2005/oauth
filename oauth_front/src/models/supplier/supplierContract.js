import lodash from "lodash"
import * as supplierContractService from "../../services/supplier/supplierContract"

export default {
	namespace: "supplierContract",
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
			const data = yield call(supplierContractService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierContractService.create, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* update({payload}, {call, put}) {
			yield call(supplierContractService.update, payload)
			yield put({
				type: "query",
				payload: {
					supplierCode: payload.supplierCode
				}
			})
		}
	},
	subscriptions: {}
}
