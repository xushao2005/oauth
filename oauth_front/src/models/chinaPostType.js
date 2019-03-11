import lodash from "lodash"
import * as chinaPostTypeService from "../services/chinaPostType"

export default {
	namespace: "chinaPostType",
	state: {
		list: []
	},
	reducers: {
		// 保存数据到 state
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(chinaPostTypeService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, "query")
			yield call(chinaPostTypeService.update, params)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(chinaPostTypeService.create, payload)
			yield put({
				type: "query"
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/china-post-type") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
