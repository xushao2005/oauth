import * as customerOpsService from "../../services/customer/customerOps"

export default {
	namespace: "tmsStatus",
	state: {
		result: null // 执行交接操作结果
	},
	reducers: {
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
		}
	},
	effects: {
		* tmsStatusOpsStart({payload}, {call, put}) {
			try {
				const {data} = yield call(customerOpsService.tmsStatusOps, payload)
				yield put({type: "saveResult", payload: data})
			} catch (e) {
				yield put({type: "saveResult",
					payload: {
						success: false,
						message: e.response ? e.response.data.error : "网络异常"
					}
				})
			}
		}
	},
	subscriptions: {}
}
