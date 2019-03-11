import * as supplierPayCycleService from "../../services/select/supplierPayCycles"

export default {
	namespace: "selectSupplierPayCycle",
	state: {
		supplierPayCycles: []
	},
	reducers: {
		load(state, {payload}) {
			return {
				...state,
				...payload
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {supplierTypes} = yield select(state => state)
			if (supplierTypes === undefined || supplierTypes.length === 0) {
				const {data} = yield call(supplierPayCycleService.selection)
				yield put({type: "load", payload: {supplierPayCycles: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
