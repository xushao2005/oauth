import {routerRedux} from "dva/router"
import lodash from "lodash"
import queryString from "query-string"
import * as regionService from "../services/region/region"

export default {
	namespace: "region",
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
		currentRegion: {}
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
		saveRegion(state, {payload: currentRegion}) {
			return {
				...state,
				currentRegion
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(regionService.query, payload)
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
			yield call(regionService.update, params)
			yield put({
				type: "query",
				payload: payload.query
			})
		},
		* create({payload}, {call, put}) {
			yield call(regionService.create, payload)
			yield put(routerRedux.replace({
				pathname: "/dict/country"
			}))
		},
		* view({payload}, {call, put}) {
			const {data: region} = yield call(regionService.view, payload)
			yield put({
				type: "saveRegion",
				payload: region
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/country") {
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
