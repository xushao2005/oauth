import * as serviceUnits from "../../services/select/serviceUnits"

export default {
	namespace: "selectUnits",
	state: {
		units: []
	},
	reducers: {
		saveUnits(state, {payload: units}) {
			return {
				...state,
				units
			}
		}
	},
	effects: {
		* selection({payload}, {call, select, put}) {
			const {selectUnits} = yield select(_ => _)
			if (selectUnits.units.length === 0) {
				const {data} = yield call(serviceUnits.selection, payload)
				yield put({type: "saveUnits", payload: data})
			}
		}
	},
	subscriptions: {}
}
