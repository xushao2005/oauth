import * as supplierService from "../../services/supplier/supplier"

export default {
	namespace: "selectSupplier",
	state: {
		suppliers: [],
		suppliersPayAccount: [],
	},
	reducers: {
		saveSuppliers(state, {payload: suppliers}) {
			return {
				...state,
				suppliers
			}
		},
		saveSuppliersAccount(state, {payload: suppliersPayAccount}) {
			return {
				...state,
				suppliersPayAccount
			}
		},
	},
	effects: {
		* selection({payload}, {call, put}) {
			const {data} = yield call(supplierService.selection, payload)
			yield put({type: "saveSuppliers", payload: data})
		},
		* autoCompleteSupplierAccount({payload}, {call, put}) {
			const {data} = yield call(supplierService.autoCompleteSupplierAccount, payload)
			yield put({type: "saveSuppliersAccount", payload: data})
		},
	},
	subscriptions: {}
}
