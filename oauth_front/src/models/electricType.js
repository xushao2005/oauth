import * as electricTypeService from "../services/electricType"

export default {
	namespace: "electricType",
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
		* query(_, {call, put}) {
			const data = yield call(electricTypeService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		}
	},
	subscriptions: {}
}
