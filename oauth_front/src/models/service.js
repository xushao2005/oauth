import {routerRedux} from "dva/router"
import lodash from "lodash"
import queryString from "query-string"
import * as services from "../services/services"

export default {
	namespace: "service",
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
		currentService: {},
		nextCode: null
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
		saveCurrent(state, {payload: currentService}) {
			return {
				...state,
				currentService
			}
		},
		saveNextCode(state, {payload: nextCode}) {
			return {
				...state,
				nextCode
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(services.query, payload)
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
		* view({payload}, {call, put}) {
			const {data: service} = yield call(services.view, payload)
			yield put({
				type: "saveCurrent",
				payload: service
			})
		},
		* create({payload}, {call, put}) {
			yield call(services.create, payload)
			yield put(routerRedux.replace({
				pathname: "/services",
				search: queryString.stringify({
					serviceCode: payload.code
				})
			}))
		},
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, "query")
			yield call(services.update, params)
			yield put({
				type: "query",
				payload: payload.query
			})
		},
		* nextCode({payload}, {call, put}) {
			const data = yield call(services.nextCode, payload)
			yield put({
				type: "saveNextCode",
				payload: data.data
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/services") {
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
					dispatch({
						type: "selectUnits/selection"
					})
					dispatch({
						type: "transportMode/query"
					})
				}
			})
		}
	}
}
