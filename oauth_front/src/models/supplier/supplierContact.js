import lodash from "lodash"
import * as supplierContactService from "../../services/supplier/supplierContact"

export default {
	namespace: "supplierContact",
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
			const data = yield call(supplierContactService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(supplierContactService.update, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierContactService.create, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		},
		* remove({payload}, {call, put}) {
			yield call(supplierContactService.remove, payload)
			const query = lodash.pick(payload, "supplierCode")
			yield put({
				type: "query",
				payload: query
			})
		}
	},
	subscriptions: {}
}
