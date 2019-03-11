import queryString from "query-string"
import * as searchContactService from "../../services/customer/searchContact"

export default {
	namespace: "searchContact",
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
			let list = []
			let pages = 0
			if (Object.keys(payload).length > 0) {
				const data = yield call(searchContactService.searchByContact, payload)
				list = data.data
				pages = data.total
			}
			yield put({
				type: "load",
				payload: {
					list,
					pagination: {
						current: Number(payload.page),
						pageSize: Number(payload.pageSize),
						total: Number(pages) || 0
					}
				}
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/customers/search-by-contact") {
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
