import * as supplierPaymentTermService from "../../services/select/supplierPaymentTerm"

export default {
	namespace: "selectPaymentTerms",
	state: {
		paymentTerms: []
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
				const {data} = yield call(supplierPaymentTermService.selection)
				yield put({type: "load", payload: {paymentTerms: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
