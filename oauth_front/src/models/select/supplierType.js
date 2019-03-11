import * as supplierTypeService from "../../services/select/supplierTypes"

export default {
	namespace: "selectSupplierTypes",
	state: {
		supplierTypes: []
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
				const {data} = yield call(supplierTypeService.selection)
				yield put({type: "load", payload: {supplierTypes: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
