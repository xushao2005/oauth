import {routerRedux} from "dva/router"
import queryString from "query-string"
import * as chargeItemTypeService from "../services/chargeItemType"
import {patterns} from "../utils/form"

export default {
	namespace: "chargeItemType",
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
		current: {}
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
				}
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
			const data = yield call(chargeItemTypeService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data.map((it) => {
						if (it.code === "-1") {
							it.code = "N"
						}
						return it
					}),
					pagination: {
						current: Number(payload.page),
						pageSize: Number(payload.pageSize),
						total: Number(data.total) || 0
					}
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(chargeItemTypeService.update, payload)
			yield put(routerRedux.replace({
				pathname: "/dict/charge-item-types",
				search: queryString.stringify({code: payload.code})
			}))
		},
		* create({payload}, {call, put}) {
			yield call(chargeItemTypeService.create, payload)
			yield put(routerRedux.replace({
				pathname: "/dict/charge-item-types",
				search: queryString.stringify({code: payload.code})
			}))
		},
		* view({payload}, {call, put}) {
			const {data: current} = yield call(chargeItemTypeService.view, payload)
			if (current.code === "-1") {
				current.code = "N"
			}
			yield put({
				type: "saveCurrent",
				payload: current
			})
		},
		* codeExists({payload}, {call}) {
			if (!payload.code) {
				return true
			}
			if (!patterns.digit.test(payload.code)) {
				return true
			}
			const {data: result} = yield call(chargeItemTypeService.codeExists, payload)
			return !result
		},
		* uniqueName({payload}, {call}) {
			if (!payload.name) {
				return true
			}
			if (payload.code === "N") {
				payload.code = -1
			}
			const {data: result} = yield call(chargeItemTypeService.nameExists, payload)
			return !result
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/charge-item-types") {
					dispatch({
						type: "query",
						payload: location.query
					})
				}
			})
		}
	}
}
