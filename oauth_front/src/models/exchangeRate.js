import {routerRedux} from "dva/router"
import lodash from "lodash"
import queryString from "query-string"
import * as exchangeRateService from "../services/exchangeRate"

export default {
	namespace: "exchangeRate",
	state: {
		list: [],
		pagination: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共${total}条记录`,
			current: 1,
			pageSize: 10,
			total: 0
		}
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
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(exchangeRateService.query, payload)
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
			const params = lodash.omit(payload, "query")
			yield call(exchangeRateService.update, params)
			yield put({
				type: "query",
				payload: payload.query
			})
		},
		* create({payload}, {call, put}) {
			yield call(exchangeRateService.create, payload)
			yield put(routerRedux.replace({
				pathname: "/exchange-rates"
			}))
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/exchange-rates") {
					dispatch({
						type: "selectCurrency/selection"
					})
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
