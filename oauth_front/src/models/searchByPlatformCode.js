import queryString from "query-string"
import * as searchByPlatformCode from "../services/searchByPlatformCode"

export default {
	namespace: "searchByPlatformCode",
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
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			let response = {}
			if (Object.keys(payload).length > 0) {
				response = yield call(searchByPlatformCode.queryPage, payload)
			}
			yield put({
				type: "load",
				payload: {
					list: response.data,
					pagination: {
						current: Number(payload.page),
						pageSize: Number(payload.pageSize),
						total: Number(response.total) || 0
					}
				}
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/customers/search-by-platform-code") {
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
