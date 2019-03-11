import {routerRedux} from "dva/router"
import lodash from "lodash"
import queryString from "query-string"
import * as productService from "../services/product"

export default {
	namespace: "product",
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
		current: {},
		productCode: null,
		expand: false,
		recommendLevels: [{id: 0, value: "自有产品"}, {id: 1, value: "非自有产品"}]
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
		saveCurrent(state, {payload: current}) {
			return {
				...state,
				current
			}
		},
		saveProductCode(state, {payload: productCode}) {
			return {
				...state,
				productCode
			}
		},
		toggleFilter(state) {
			return {
				...state,
				expand: !state.expand
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(productService.query, payload)
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
			yield call(productService.update, params)
			yield put({
				type: "query",
				payload: payload.query
			})
		},
		* create({payload}, {call, put}) {
			yield call(productService.create, payload)
			yield put(routerRedux.replace({
				pathname: "/products",
				search: queryString.stringify({
					productcode: payload.productcode
				})
			}))
		},
		* view({payload}, {call, put}) {
			const {data: product} = yield call(productService.view, payload)
			yield put({
				type: "saveCurrent",
				payload: product
			})
		},
		* nextCode(_, {call, put}) {
			const {data: productCode} = yield call(productService.nextCode)
			yield put({
				type: "saveProductCode",
				payload: productCode
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/products") {
					dispatch({
						type: "electricType/query"
					})
					dispatch({
						type: "productType/query"
					})
					dispatch({
						type: "chinaPostType/query"
					})
					dispatch({
						type: "productGroup/query"
					})
					dispatch({
						type: "saleProductType/query"
					})
					dispatch({
						type: "innerProductType/query"
					})
					dispatch({
						type: "platformType/query"
					})
					dispatch({
						type: "limitedCatalog/query"
					})
					dispatch({
						type: "selectRegion/selection",
						payload: {
							p: "1"
						}
					})
					dispatch({
						type: "query",
						payload: queryString.parse(location.search)
					})
				}
			})
		}
	}
}
