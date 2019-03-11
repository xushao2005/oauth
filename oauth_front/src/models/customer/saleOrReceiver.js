import * as employeeService from "../../services/select/employee"
import * as customerOpsService from "../../services/customer/customerOps"

export default {
	namespace: "saleOrReceiver",
	state: {
		currentCandidates: [], // 当前客服候选
		handoverCandidates: [], // 交接客服候选
		result: null, // 执行交接操作结果
		processingInfo: {}
	},
	reducers: {
		saveCurrentCandidates(state, {payload: currentCandidates}) {
			return {
				...state,
				currentCandidates
			}
		},
		saveHandoverCandidates(state, {payload: handoverCandidates}) {
			return {
				...state,
				handoverCandidates
			}
		},
		resetResult(state) {
			return {
				...state,
				result: null
			}
		},
		saveResult(state, {payload: result}) {
			return {
				...state,
				result
			}
		},
		saveProcessingInfo(state, {payload}) {
			return {
				...state,
				processingInfo: payload
			}
		}
	},
	effects: {
		* currentMetric(_, {call, put}) {
			const {data: changelogMetric} = yield call(customerOpsService.changelogMetric)
			const {data: changeDetailMetric} = yield call(customerOpsService.changeDetailMetric)
			yield put({
				type: "saveProcessingInfo",
				payload: {
					main: changelogMetric,
					detail: changeDetailMetric
				}
			})
		},
		* currentCandidatesAutoComplete({payload}, {call, put}) {
			const {data} = yield call(employeeService.employeesAutoCompleteWithNoDuty, payload)
			yield put({type: "saveCurrentCandidates", payload: data})
		},
		* handoverCandidatesAutoComplete({payload}, {call, put}) {
			const {data} = yield call(employeeService.employeesAutoComplete, payload)
			yield put({type: "saveHandoverCandidates", payload: data})
		},
		* saleOrReceiverOpsStart({payload}, {call, put}) {
			payload.effectTime = payload.effectTime.format("YYYY-MM-DD")
			const {data} = yield call(customerOpsService.saleOrReceiverOps, payload)
			yield put({type: "saveResult", payload: data})
			yield put({type: "currentMetric"})
		},
		* preResetResult(_, {put}) {
			yield put({type: "resetResult"})
		}
	},
	subscriptions: {}
}
