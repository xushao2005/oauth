import * as payCycleService from "../../services/select/payCycle"

export default {
	namespace: "selectPayCycle",
	state: {
		payCycles: []
	},
	reducers: {
		savePayCycles(state, {payload: payCycles}) {
			return {
				...state,
				payCycles
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectPayCycle} = yield select(state => state)
			if (selectPayCycle.payCycles.length === 0) {
				const {data} = yield call(payCycleService.selection)
				yield put({type: "savePayCycles", payload: data})
			}
		}
	},
	subscriptions: {}
}
