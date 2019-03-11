import * as tmsStatusService from "../../services/select/tmsStatus"

export default {
	namespace: "selectTmsStatus",
	state: {
		tmsStatuses: []
	},
	reducers: {
		saveTmsStatus(state, {payload: tmsStatuses}) {
			return {
				...state,
				tmsStatuses
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectTmsStatus} = yield select(state => state)
			if (selectTmsStatus.tmsStatuses.length === 0) {
				const {data} = yield call(tmsStatusService.selection)
				yield put({type: "saveTmsStatus", payload: data})
			}
		}
	},
	subscriptions: {}
}
