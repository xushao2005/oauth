import * as customerService from "../../services/customer/customer"


export default {
	namespace: "customerFinance",
	state: {
		editable: false,
		mainAccounts: [], // 付款主客户或关联客户列表暂存
		mainAccountId: null, // 付款客户或关联客户临时id
		mainCustomers: [], // 自动补全的待选付款主客户
	},
	reducers: {
		handleEditable(state, {payload}) {
			return {
				...state,
				editable: payload.isEdit
			}
		},
		saveMainAccounts(state, {payload: mainAccounts}) {
			return {
				...state,
				mainAccounts,
			}
		},
		changeMainAccountId(state, {payload: mainAccountId}) {
			return {
				...state,
				mainAccountId
			}
		},
		saveMainCustomers(state, {payload: mainCustomers}) {
			return {
				...state,
				mainCustomers
			}
		},
		clearMainCustomers(state) {
			return {
				...state,
				mainCustomers: []
			}
		}
	},
	effects: {
		* mainAccounts({payload}, {call, put}) {
			const {data: mainAccounts} = yield call(customerService.mainAccounts, payload)
			yield put({
				type: "saveMainAccounts",
				payload: mainAccounts
			})
		},
		* queryMainCustomers({payload}, {call, put}) {
			const {data} = yield call(customerService.query, payload)
			yield put({
				type: "saveMainCustomers",
				payload: data
			})
		}
	},
	subscriptions: {}
}
