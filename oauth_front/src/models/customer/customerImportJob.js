import * as customerImportJobService from "../../services/customer/customerImportJob"

export default {
	namespace: "customerImportJob",
	state: {
		list: [],
		pagination: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共${total}条记录`,
			current: 1,
			pageSize: 10,
			total: 0
		},
		items: [],
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
		saveItems(state, {payload}) {
			const {items} = payload
			return {
				...state,
				items
			}
		},
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(customerImportJobService.jobs, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data,
					pagination: {
						current: Number(payload.page),
						pageSize: Number(payload.pageSize),
						total: Number(data.total) || 0
					}
				}
			})
		},
		* queryItems({payload}, {call, put}) {
			const data = yield call(customerImportJobService.items, payload)
			yield put({
				type: "saveItems",
				payload: {
					items: data.data
				}
			})
		},
	},
	subscriptions: {}
}
