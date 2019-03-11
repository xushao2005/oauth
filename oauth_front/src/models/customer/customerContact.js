import lodash from "lodash"
import * as customerContactService from "../../services/customer/customerContact"

export default {
	namespace: "customerContact",
	state: {
		list: [],
		currentId: null,
		editable: false,
		creatable: false
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
		reload(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveCurrentId(state, {payload: currentId}) {
			return {
				...state,
				currentId,
				editable: false
			}
		},
		makeEditable(state) {
			return {
				...state,
				editable: true
			}
		},
		makeUnEditable(state) {
			return {
				...state,
				editable: false
			}
		},
		makeCreatable(state) {
			return {
				...state,
				creatable: true
			}
		},
		makeUnCreatable(state) {
			return {
				...state,
				creatable: false
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(customerContactService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* create({payload}, {call, put}) {
			const params = lodash.omit(payload, "pickupAddress")
			params.province = payload.pickupAddress.province
			params.city = payload.pickupAddress.city
			params.district = payload.pickupAddress.district
			params.streetAddress = payload.pickupAddress.streetAddress
			yield call(customerContactService.create, params)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
			yield put({
				type: "makeUnCreatable"
			})
			yield put({
				type: "customer/view",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(customerContactService.remove, {id: payload.id})
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* setDefault({payload}, {call, put}) {
			yield call(customerContactService.setDefault, {id: payload.id})
			yield put({
				type: "reQuery",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, "pickupAddress")
			params.province = payload.pickupAddress.province
			params.city = payload.pickupAddress.city
			params.district = payload.pickupAddress.district
			params.streetAddress = payload.pickupAddress.streetAddress
			yield call(customerContactService.update, params)
			yield put({
				type: "reQuery",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* reQuery({payload}, {call, put}) {
			const data = yield call(customerContactService.query, payload)
			yield put({
				type: "reload",
				payload: {
					list: data.data
				}
			})
		},
		* changeCurrentId({payload: currentId}, {select, put}) {
			const {customerContact} = yield select(_ => _)
			const oldCurrentId = customerContact.currentId
			if (oldCurrentId !== currentId) {
				yield put({
					type: "saveCurrentId",
					payload: currentId
				})
			}
		}
	},
	subscriptions: {}
}
