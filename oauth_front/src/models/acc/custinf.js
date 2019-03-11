import * as custinfService from "../../services/acc/custinf"

export default {
	namespace: "custinf",
	state: {
		list: [],
		pagination: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共${total}条记录`,
			current: 1,
			pageSize: 100,
			total: 0,
			defaultPageSize: 100,
			pageSizeOptions: ["100", "200"]
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
		clearCacheList(state) {
			return {
				...state,
				list: [],
				pagination: {
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: total => `共${total}条记录`,
					current: 1,
					pageSize: 100,
					total: 0,
					defaultPageSize: 100,
					pageSizeOptions: ["100", "200"]
				}
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(custinfService.query, payload)
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
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/acc/custinfs") {
					dispatch({
						type: "selectCompany/selection"
					})
					dispatch({
						type: "selectPayCycle/selection"
					})
					if (location.query.do === "1") {
						dispatch({
							type: "query",
							payload: location.query
						})
					} else {
						dispatch({
							type: "clearCacheList"
						})
					}
				}
			})
		}
	}
}
