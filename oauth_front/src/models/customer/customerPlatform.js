import * as customerPlatformService from "../../services/customer/customerPlatform"

export default {
	namespace: "customerPlatform",
	state: {
		list: [],
		pagination: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共${total}条记录`,
			current: 1,
			pageSize: 10,
			total: 0
		}
	},
	reducers: {
		load(state, {payload}) {
			const {list, pagination} = payload
			return {
				...state,
				list,
				pagination: {
					...state.pagination,
					...pagination
				}
			}
		},
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(customerPlatformService.query, payload)
			if (!payload.query) {
				payload.query = {}
			}
			yield put({
				type: "load",
				payload: {
					list: data.data,
					pagination: {
						current: Number(payload.query.page),
						pageSize: Number(payload.query.pageSize),
						total: Number(data.total) || 0
					}
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(customerPlatformService.create, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(customerPlatformService.update, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
		* remove({payload}, {call, put}) {
			yield call(customerPlatformService.remove, payload)
			yield put({
				type: "query",
				payload: {
					customerCode: payload.customerCode
				}
			})
		},
	},
	subscriptions: {}
}
