import queryString from "query-string"
import * as periodBillService from "../../services/acc/periodbill"

export default {
	namespace: "periodBill",
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
			const data = yield call(periodBillService.query, payload)
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
				if (location.pathname === "/accPeriod/periodBills") {
					dispatch({
						type: "selectBillPeriod/selection"
					})
					if (location.query.do === "1") {
						dispatch({
							type: "query",
							payload: queryString.parse(location.search)
						})
					}
				}
			})
		}
	}
}
