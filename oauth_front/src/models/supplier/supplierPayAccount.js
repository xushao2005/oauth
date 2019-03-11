import lodash from "lodash"
import * as supplierPayAccountService from "../../services/supplier/supplierPayAccount"

export default {
	namespace: "supplierPayAccount",
	state: {
		list: [],
		current: {}
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveCurrent(state, {payload: current}) {
			return {
				...state,
				current
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(supplierPayAccountService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(supplierPayAccountService.update, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierPayAccountService.create, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* view({payload}, {call, put}) {
			const {data: current} = yield call(supplierPayAccountService.view, payload)
			yield put({
				type: "saveCurrent",
				payload: current
			})
		},
		* remove({payload}, {call, put}) {
			yield call(supplierPayAccountService.remove, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* codeExists({payload}, {call}) {
			if (!payload.payAccountId) {
				return true
			}
			const {data: result} = yield call(supplierPayAccountService.codeExists, payload)
			return !result
		}
	},
	subscriptions: {}
}
