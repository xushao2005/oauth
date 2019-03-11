import lodash from "lodash"
import * as customerConsignorService from "../../services/customer/customerConsignor"

export default {
	namespace: "customerConsignor",
	state: {
		list: [],
		autoCompleteList: [],
		selectable: false,
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
		},
		saveAutoCompleteList(state, {payload: autoCompleteList}) {
			return {
				...state,
				autoCompleteList
			}
		},
		makeSelectable(state) {
			return {
				...state,
				selectable: true
			}
		},
		makeUnSelectable(state) {
			return {
				...state,
				selectable: false
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(customerConsignorService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* create({payload}, {call, put}) {
			const params = lodash.omit(payload, "pickupAddress")
			if (payload.productNames) {
				const productNames = payload.productNames.value
				const separator = /、|\n|\r/
				const productNameArray = productNames.split(separator)
				params.productNames = productNameArray
			}
			params.sprovince = payload.pickupAddress.sprovince
			params.scity = payload.pickupAddress.scity
			params.sdistrict = payload.pickupAddress.sdistrict
			params.saddress = payload.pickupAddress.saddress
			params.saddressCh = payload.pickupAddress.saddressCh
			yield call(customerConsignorService.create, params)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
			yield put({
				type: "makeUnCreatable"
			})
		},
		* remove({payload}, {call, put}) {
			yield call(customerConsignorService.remove, {id: payload.id})
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, "pickupAddress")
			if (payload.productNames) {
				const productNames = payload.productNames.value
				const separator = /、|\n|\r/
				const productNameArray = productNames.split(separator)
				params.productNames = productNameArray
			}
			params.sprovince = payload.pickupAddress.sprovince
			params.scity = payload.pickupAddress.scity
			params.sdistrict = payload.pickupAddress.sdistrict
			params.saddress = payload.pickupAddress.saddress
			params.saddressCh = payload.pickupAddress.saddressCh
			yield call(customerConsignorService.update, params)
			yield put({
				type: "reQuery",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* reQuery({payload}, {call, put}) {
			const data = yield call(customerConsignorService.query, payload)
			yield put({
				type: "reload",
				payload: {
					list: data.data
				}
			})
			// 重置 autoCompleteList 数据 ：为了解决autoCompleteList数据已存在，list更变之后autoCompleteList数据没有更新问题
			// const {customerConsignor} = yield select(_ => _)
			// if (customerConsignor.selectable && customerConsignor.autoCompleteList.length > 0) {
			// 	const temp = []
			// 	data.data.forEach((item) => {
			// 		customerConsignor.autoCompleteList.forEach((it) => {
			// 			if (item.id === it.id) {
			// 				temp.push(item)
			// 			}
			// 		})
			// 	})
			// 	yield put({
			// 		type: "saveAutoCompleteList",
			// 		payload: temp
			// 	})
			// }
		},
		* changeCurrentId({payload: currentId}, {select, put}) {
			const {customerConsignor} = yield select(_ => _)
			const oldCurrentId = customerConsignor.currentId
			if (oldCurrentId !== currentId) {
				yield put({
					type: "saveCurrentId",
					payload: currentId
				})
			}
		},
		* setDefault({payload}, {call, put}) {
			yield call(customerConsignorService.setDefault, {id: payload.id})
			yield put({
				type: "reQuery",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* changeAutoCompleteList({payload: autoCompleteList}, {put}) {
			yield put({
				type: "saveAutoCompleteList",
				payload: autoCompleteList
			})
		}
	},
	subscriptions: {}
}
