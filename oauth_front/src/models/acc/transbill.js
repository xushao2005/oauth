import * as transbillService from "../../services/acc/transbill"

export default {
	namespace: "transbill",
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
		query: {}
	},
	reducers: {
		load(state, {payload}) {
			const {list, pagination, query} = payload
			return {
				...state,
				list,
				pagination: {
					...state.pagination,
					...pagination
				},
				query
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(transbillService.query, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data,
					pagination: {
						current: Number(payload.page) || 1,
						pageSize: Number(payload.pageSize) || 10,
						total: Number(data.total) || 0
					},
					query: payload
				}
			})
		}
	},
	subscriptions: {}
}
