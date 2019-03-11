import * as serviceCalcTypeService from "../services/serviceCalcType"

export default {
	namespace: "serviceCalcType",
	state: {
		list: []
		//currentTransportMode: {}
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
			const data = yield call(serviceCalcTypeService.selection)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/services") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
