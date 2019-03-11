import * as productService from "../../services/select/product"

export default {
	namespace: "selectProduct",
	state: {
		products: []
	},
	reducers: {
		saveProducts(state, {payload: products}) {
			return {
				...state,
				products
			}
		}
	},
	effects: {
		* selection({payload}, {call, put}) {
			const {data} = yield call(productService.selection, payload)
			yield put({type: "saveProducts", payload: data})
		}
	},
	subscriptions: {}
}
