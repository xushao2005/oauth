import * as saleProductType from "../services/saleProductType"

export default {
	namespace: "saleProductType",
	state: {
		list: [],
		currentSaleProductType: {}
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveSaleProductType(state, {payload: currentSaleProductType}) {
			return {
				...state,
				currentSaleProductType
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(saleProductType.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(saleProductType.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(saleProductType.create, payload)
			yield put({
				type: "query"
			})
		},
		* view({payload}, {call, put}) {
			const {data: currentSaleProductType} = yield call(saleProductType.view, payload)
			yield put({
				type: "saveSaleProductType",
				payload: currentSaleProductType
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dist/sale-product-type") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
