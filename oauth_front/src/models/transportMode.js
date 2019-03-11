import * as transportModeService from "../services/transportMode"

export default {
	namespace: "transportMode",
	state: {
		list: [],
		currentTransportMode: {}
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveTransportMode(state, {payload: currentTransportMode}) {
			return {
				...state,
				currentTransportMode
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(transportModeService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(transportModeService.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(transportModeService.create, payload)
			yield put({
				type: "query"
			})
		},
		* view({payload}, {call, put}) {
			const {data: transportMode} = yield call(transportModeService.view, payload)
			yield put({
				type: "saveTransportMode",
				payload: transportMode
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/transport-mode") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
