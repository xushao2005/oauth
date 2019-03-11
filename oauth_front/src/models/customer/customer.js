import lodash from "lodash"
import * as customerService from "../../services/customer/customer"

export default {
	namespace: "customer",
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
		currentCustomer: {},
		cacheCustomer: {}, // 新增客户数据暂存
		editable: false,
		mainTab: true,
		currentTab: "baseInfo",
		current: 0,
		expand: false, // 控制搜索的收缩和展开，搜索项的显示与隐藏
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
		saveCustomer(state, {payload: currentCustomer}) {
			return {
				...state,
				currentCustomer
			}
		},
		saveCacheCustomer(state, {payload: cacheCustomer}) {
			return {
				...state,
				cacheCustomer: {
					...state.cacheCustomer,
					...cacheCustomer
				}
			}
		},
		saveCurrentCustomer(state, {payload: currentCustomer}) {
			return {
				...state,
				currentCustomer: {
					...state.currentCustomer,
					...currentCustomer
				}
			}
		},
		saveMainTab(state, {payload: tab}) {
			const mainTab = tab === "baseInfo"
			return {
				...state,
				currentTab: tab,
				mainTab
			}
		},
		changeCurrentStep(state, {payload: current}) {
			return {
				...state,
				current
			}
		},
		clearCacheCustomer(state) {
			return {
				...state,
				cacheCustomer: {},
				current: 0
			}
		},
		makeEditable(state) {
			return {
				...state,
				editable: true
			}
		},
		makeUnEditable(state) {
			return {
				...state,
				editable: false
			}
		},
		saveInitCustomer(state, {payload: customer}) {
			return {
				...state,
				currentCustomer: {
					...state.currentCustomer,
					...customer
				}
			}
		},
		toggleFilter(state) {
			return {
				...state,
				expand: !state.expand
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
					pageSize: 10,
					total: 0
				}
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			// 创建时间
			if (payload.createTime && payload.createTime[0]) {
				payload.startTime = payload.createTime[0]
			}
			if (payload.createTime && payload.createTime[1]) {
				payload.endTime = payload.createTime[1]
			}
			let params = lodash.omit(payload, "createTime")
			// 转正时间
			if (payload.signTime && payload.signTime[0]) {
				payload.signedStartTime = payload.signTime[0]
			}
			if (payload.signTime && payload.signTime[1]) {
				payload.signedEndTime = payload.signTime[1]
			}
			params = lodash.omit(payload, "signTime")
			const data = yield call(customerService.query, params)
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
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, "query")
			yield call(customerService.update, params)
			yield put({
				type: "view",
				payload: {customerCode: params.customerCode}
			})
		},
		* updateFinance({payload}, {call, put}) {
			const params = lodash.omit(payload, "query")
			yield call(customerService.updateFinance, params)
			yield put({
				type: "view",
				payload: {customerCode: params.customerCode}
			})
			// 请求主付款客户
			params.dispatch({
				type: "customerFinance/mainAccounts",
				payload: {
					customerCode: params.customerCode
				}
			})
		},
		* view({payload}, {call, put}) {
			const [{data: customer}, {data: checkIntegrity}] = yield [
				call(customerService.view, payload),
				call(customerService.checkIntegrity, payload)
			]
			const params = {...customer, integrity: checkIntegrity}
			yield put({
				type: "saveCustomer",
				payload: params
			})
		},
		* create(_, {call, select, put}) {
			const {cacheCustomer} = yield select(state => state.customer)
			const params = lodash.omit(cacheCustomer, "returnAddress", "contact", "currentSettleCompanyName")
			const contactParams = lodash.omit(cacheCustomer.contact, "pickupAddress")
			if (cacheCustomer.returnAddress) {
				params.returnProvince = cacheCustomer.returnAddress.province
				params.returnCity = cacheCustomer.returnAddress.city
				params.returnDistrict = cacheCustomer.returnAddress.district
				params.returnStreetAddress = cacheCustomer.returnAddress.streetAddress
			}
			params.contact = {
				province: cacheCustomer.contact.pickupAddress.province,
				city: cacheCustomer.contact.pickupAddress.city,
				district: cacheCustomer.contact.pickupAddress.district,
				streetAddress: cacheCustomer.contact.pickupAddress.streetAddress,
				...contactParams
			}
			yield call(customerService.create, params)
			yield put({
				type: "changeCurrentStep",
				payload: 3
			})
		},
		* entryToCreateCustomer({payload}, {call, put}) {
			const {data: customerCode} = yield call(customerService.nextCustomerCode,
				{wareHouseCode: payload.currentAffiliatedCompanyId})
			yield put({
				type: "saveCacheCustomer",
				payload: {
					customerCode,
					...lodash.omit(payload, "current")
				}
			})
			yield put({
				type: "changeCurrentStep",
				payload: payload.current
			})
		},
		* stepCacheCustomer({payload}, {put}) {
			yield put({
				type: "saveCacheCustomer",
				payload: lodash.omit(payload, "current")
			})
			yield put({
				type: "changeCurrentStep",
				payload: payload.current
			})
		},
		* customerTypeInit({payload}, {call, put}) { // 初始化用户类型
			yield call(customerService.customerInitVo, payload)
			const [{data: customer}, {data: checkIntegrity}] = yield [
				call(customerService.view, payload),
				call(customerService.checkIntegrity, payload)
			]
			const params = {...customer, integrity: checkIntegrity}
			yield put({
				type: "saveCustomer",
				payload: params
			})
		},
		* customerSignVo({payload}, {call, put}) { // 转正请求
			yield call(customerService.customerSignVo, payload)
			yield put({
				type: "saveInitCustomer",
				payload: {
					signedWithYanwen: payload.signedWithYanwen
				}
			})
		},
		* customerAutoDefrostVo({payload}, {call, put}) {
			yield call(customerService.customerAutoDefrostVo, payload)
			yield put({
				type: "saveInitCustomer",
				payload: {
					autoDefrost: payload.autoDefrost
				}
			})
		},
		* changeToPersonal({payload}, {call, put}) {
			yield call(customerService.changeToPersonal, payload)
			yield put({
				type: "view",
				payload: {customerCode: payload.customerCode}
			})
		},
		* changeToCompany({payload}, {call, put}) {
			yield call(customerService.changeToCompany, payload)
			yield put({
				type: "view",
				payload: {customerCode: payload.customerCode}
			})
		},
		//支持单个活动客户的冻结功能
		* ejfStatusFrozen({payload}, {call, put}) {
			yield call(customerService.ejfStatusFrozen, payload)
			yield put({
				type: "view",
				payload: {customerCode: payload.customerCode}
			})
		},
		* adminPhoneExists({payload}, {call}) {
			if (!payload.adminPhone) {
				return true
			}
			const {data: result} = yield call(customerService.adminPhoneExists, payload)
			return !result
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/customers") {
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
