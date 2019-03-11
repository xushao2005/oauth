import * as billPeriodService from "../../services/select/billPeriod"

export default {
	namespace: "selectBillPeriod",
	state: {
		billPeriods: []
	},
	reducers: {
		saveBillPeriods(state, {payload: billPeriods}) {
			return {
				...state,
				billPeriods
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectBillPeriod} = yield select(state => state)
			if (selectBillPeriod.billPeriods.length === 0) {
				const {data} = yield call(billPeriodService.selection)
				yield put({type: "saveBillPeriods", payload: data})
			}
		}
	},
	subscriptions: {}
}
