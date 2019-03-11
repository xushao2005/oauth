import * as employeeService from "../../services/select/employee"

export default {
	namespace: "selectEmployee",
	state: {
		sales: [], // 销售
		checks: [], // 对账
		receipts: [], // 催收
		employees: [] // 介绍人
	},
	reducers: {
		saveSales(state, {payload: sales}) {
			return {
				...state,
				sales
			}
		},
		saveChecks(state, {payload: checks}) {
			return {
				...state,
				checks
			}
		},
		saveReceipts(state, {payload: receipts}) {
			return {
				...state,
				receipts
			}
		},
		saveEmployees(state, {payload: employees}) {
			return {
				...state,
				employees
			}
		}
	},
	effects: {
		* salesAutoComplete({payload}, {call, put}) {
			const {data} = yield call(employeeService.salesAutoComplete, payload)
			yield put({type: "saveSales", payload: data})
		},
		* checksAutoComplete({payload}, {call, put}) {
			const {data} = yield call(employeeService.checksAutoComplete, payload)
			yield put({type: "saveChecks", payload: data})
		},
		* receiptsAutoComplete({payload}, {call, put}) {
			const {data} = yield call(employeeService.receiptsAutoComplete, payload)
			yield put({type: "saveReceipts", payload: data})
		},
		* employeesAutoComplete({payload, onComplete}, {call, put}) {
			const {data} = yield call(employeeService.employeesAutoComplete, payload)
			yield put({type: "saveEmployees", payload: data})
			if (onComplete) {
				onComplete(data)
			}
		}
	},
	subscriptions: {}
}
