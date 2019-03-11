import * as paymentCompanyService from "../services/paymentCompany"

export default {
	namespace: "paymentCompany",
	state: {
		list: [],
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(paymentCompanyService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(paymentCompanyService.update, payload)
			yield put({
				type: "query"
			})
			yield put({
				type: "selectSupplierPaymentCompany/selection"
			})
		},
		* create({payload}, {call, put}) {
			yield call(paymentCompanyService.create, payload)
			yield put({
				type: "query"
			})
			yield put({
				type: "selectSupplierPaymentCompany/selection"
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/payment-company") {
					dispatch({
						type: "paymentCompany/query"
					})
				}
			})
		}
	}
}
