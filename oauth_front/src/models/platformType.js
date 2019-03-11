import {routerRedux} from "dva/router"
import queryString from "query-string"
import * as platformTypeService from "../services/platformType"
import {patterns} from "../utils/form"

export default {
	namespace: "platformType",
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
			const data = yield call(platformTypeService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(platformTypeService.update, payload)
			yield put(routerRedux.replace({
				pathname: "/dict/platform-types",
				search: queryString.stringify({code: payload.code})
			}))
		},
		* create({payload}, {call, put}) {
			yield call(platformTypeService.create, payload)
			yield put(routerRedux.replace({
				pathname: "/dict/platform-types",
				search: queryString.stringify({code: payload.code})
			}))
		},
		* view({payload}, {call, put}) {
			const {data: current} = yield call(platformTypeService.view, payload)
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
			const {data: result} = yield call(platformTypeService.codeExists, payload)
			return !result
		},
		* uniqueName({payload}, {call}) {
			if (!payload.name) {
				return true
			}
			if (payload.code === "N") {
				payload.code = -1
			}
			const {data: result} = yield call(platformTypeService.nameExists, payload)
			return !result
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/platform-types") {
					dispatch({
						type: "query",
						payload: location.query
					})
				}
			})
		}
	}
}
