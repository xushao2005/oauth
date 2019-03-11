import * as supplierRebateTypeService from "../../services/select/supplierRebateType"

export default {
	namespace: "selectRebateTypes",
	state: {
		rebateTypes: []
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
				const {data} = yield call(supplierRebateTypeService.selection)
				yield put({type: "load", payload: {rebateTypes: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
