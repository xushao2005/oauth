import {routerRedux} from "dva/router"
import queryString from "query-string"
import lodash from "lodash"
import * as supplierService from "../../services/supplier/supplier"

export default {
	namespace: "supplier",
	state: {
		list: [],
		pagination: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共${total}条记录`,
			current: 1,
			pageSize: 10,
			total: 0
		},
		currentSupplier: {},
		cacheSupplier: {},
		editable: false,
		mainTab: true,
		paymentTab: false,
		supplierCode: null
	},
	reducers: {
		load(state, {payload}) {
			const {list, pagination} = payload
			return {
				...state,
				list,
				pagination: {
					...state.pagination,
					...pagination
				},
			}
		},
		saveMainTab(state, {payload: mainTab}) {
			return {
				...state,
				mainTab
			}
		},
		savePaymentTab(state, {payload: paymentTab}) {
			return {
				...state,
				paymentTab
			}
		},
		saveSupplier(state, {payload: currentSupplier}) {
			return {
				...state,
				currentSupplier
			}
		},
		cacheSupplierAttach(state, {payload: cacheSupplier}) {
			return {
				...state,
				cacheSupplier
			}
		},
		clearCacheSupplierAttach(state) {
			return {
				...state,
				cacheSupplier: {}
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
		saveSupplierCode(state, {payload: supplierCode}) {
			return {
				...state,
				supplierCode
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			if (payload.createTime && payload.createTime[0]) {
				payload.startTime = payload.createTime[0]
			}
			if (payload.createTime && payload.createTime[1]) {
				payload.endTime = payload.createTime[1]
			}
			const params = lodash.omit(payload, "createTime")
			const data = yield call(supplierService.query, params)
			yield put({
				type: "load",
				payload: {
					list: data.data,
					pagination: {
						current: Number(payload.page),
						pageSize: Number(payload.pageSize),
						total: Number(data.total) || 0
					}
				}
			})
		},
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, ["query", "isPaymentInfo"])
			if (payload.isPaymentInfo) {
				yield call(supplierService.updatePaymentInfo, params)
			} else {
				yield call(supplierService.update, params)
			}
			yield put({
				type: "query",
				payload: payload.query
			})
			yield put({
				type: "view",
				payload: {
					id: params.code
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(supplierService.create, payload)
			yield put(routerRedux.replace({
				pathname: "/suppliers",
				search: queryString.stringify({
					code: payload.code
				})
			}))
		},
		* view({payload}, {call, put}) {
			const {data: supplier} = yield call(supplierService.view, payload)
			yield put({
				type: "saveSupplier",
				payload: supplier
			})
		},
		* nextCode(_, {call, put}) {
			const {data: supplierCode} = yield call(supplierService.nextCode)
			yield put({
				type: "saveSupplierCode",
				payload: supplierCode
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/suppliers") {
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
