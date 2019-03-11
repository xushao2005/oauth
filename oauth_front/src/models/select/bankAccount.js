import * as bankAccountService from "../../services/select/bankAccount"

export default {
	namespace: "selectBankAccounts",
	state: {
		bankAccounts: []
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
		* selection({payload}, {call, select, put}) {
			const {bankAccounts} = yield select(state => state)
			if (bankAccounts === undefined || bankAccounts.length === 0) {
				const {data} = yield call(bankAccountService.selection, payload)
				yield put({type: "load", payload: {bankAccounts: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
		}
	}
}
