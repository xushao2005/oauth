import * as productAreaTypeService from "../../services/select/productAreaType"

export default {
	namespace: "selectProductAreaTypes",
	state: {
		productAreaTypes: []
	},
	reducers: {
		load(state, {payload}) {
			return {
				...state,
				...payload
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {productAreaTypes} = yield select(state => state)
			if (productAreaTypes === undefined || productAreaTypes.length === 0) {
				const {data} = yield call(productAreaTypeService.selection)
				yield put({type: "load", payload: {productAreaTypes: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
