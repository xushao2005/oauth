import * as supplierPaymentCompanyService from "../../services/select/supplierPaymentCompany"

export default {
	namespace: "selectSupplierPaymentCompany",
	state: {
		companies: []
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
				const {data} = yield call(supplierPaymentCompanyService.selection)
				yield put({type: "load", payload: {companies: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
