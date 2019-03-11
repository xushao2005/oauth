import * as ejfStatusService from "../../services/select/ejfStatus"

export default {
	namespace: "selectEjfStatus",
	state: {
		ejfStatuses: []
	},
	reducers: {
		saveEjfStatus(state, {payload: ejfStatuses}) {
			return {
				...state,
				ejfStatuses
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectEjfStatus} = yield select(state => state)
			if (selectEjfStatus.ejfStatuses.length === 0) {
				const {data} = yield call(ejfStatusService.selection)
				yield put({type: "saveEjfStatus", payload: data})
			}
		}
	},
	subscriptions: {}
}
