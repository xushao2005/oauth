import queryString from "query-string"
import * as platformCustomerService from "../../services/customer/platformCustomer"

export default {
	namespace: "platformCustomer",
	state: {
		list: [], // 平台客户
		pagination: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共${total}条记录`,
			current: 1,
			pageSize: 10,
			total: 0
		},
		platforms: [], // 平台选项
		associateFlags: [
			{
				value: false,
				name: "未关联"
			}, {
				value: true,
				name: "已关联"
			}
		],
		modal: {
			customerList: [], // 燕文客户
			platformCustomerList: [], // 平台客户
			pagination: {
				showSizeChanger: true,
				showQuickJumper: true,
				showTotal: total => `共${total}条记录`,
				current: 1,
				pageSize: 10,
				total: 0
			},
			associateResult: {
				associateStatus: null,
				customerCode: null,
			},
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
		savePlatforms(state, {payload}) {
			return {
				...state,
				platforms: payload
			}
		},
		saveCustomerList(state, {payload}) {
			return {
				...state,
				modal: {
					...state.modal,
					customerList: payload
				}
			}
		},
		savePlatformCustomerList(state, {payload}) {
			const {platformCustomerList, pagination} = payload
			return {
				...state,
				modal: {
					...state.modal,
					platformCustomerList,
					pagination: {
						...state.modal.pagination,
						...pagination
					}
				}
			}
		},
		saveAssociateResult(state, {payload}) {
			return {
				...state,
				modal: {
					...state.modal,
					associateResult: {
						...payload
					}
				}
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(platformCustomerService.queryPage, payload)
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
			// 加载平台数据
			const {data: platforms} = yield call(platformCustomerService.platforms)
			yield put({type: "savePlatforms", payload: platforms})
		},
		* searchSimilarCustomer({payload}, {call, put}) {
			// 查询相同phone的燕文客户
			const {data} = yield call(platformCustomerService.searchByPhone, payload)
			yield put({type: "saveCustomerList", payload: data.result})
		},
		* searchSimilarPlatformCustomer({payload}, {call, put}) {
			// 分页查询相同phone的平台客户
			const data = yield call(platformCustomerService.queryPage, payload)
			yield put({
				type: "savePlatformCustomerList",
				payload: {
					platformCustomerList: data.data,
					pagination: {
						current: Number(payload.page),
						pageSize: Number(payload.pageSize),
						total: Number(data.total) || 0
					}
				}
			})
		},
		* associateBatch({payload}, {call, put}) {
			let data
			// 存在燕文客户， 关联平台客户和燕文客户；不存在则新建默认燕文客户并绑定
			if (payload.customerCode) {
				data = yield call(platformCustomerService.associate, {
					customerCode: payload.customerCode,
					ids: payload.platformCustomerIds
				})
			} else {
				data = yield call(platformCustomerService.associateDefaultCustomer,
					payload.platformCustomerId)
			}
			yield put({type: "saveAssociateResult", payload: data.data})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/customers/post-by-self") {
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
