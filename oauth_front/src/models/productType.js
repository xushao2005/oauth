import lodash from "lodash"
import * as productTypeService from "../services/productType"

export default {
	namespace: "productType",
	state: {
		list: [],
		currentProductType: {}
	},
	reducers: {
		// 保存数据到 state
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveProductType(state, {payload: currentProductType}) {
			return {
				...state,
				currentProductType
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(productTypeService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			const params = lodash.omit(payload, "query")
			yield call(productTypeService.update, params)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(productTypeService.create, payload)
			yield put({
				type: "query"
			})
		},
		* view({payload}, {call, put}) {
			const {data: productType} = yield call(productTypeService.view, payload)
			yield put({
				type: "saveProductType",
				payload: productType
			})
		}
	},
	subscriptions: {
		setup ({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/product-type") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
