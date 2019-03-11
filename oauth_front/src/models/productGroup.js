import * as productGroupService from "../services/productGroup"

export default {
	namespace: "productGroup",
	state: {
		list: [],
		currentProductGroup: {}
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		saveProductGroup(state, {payload: currentProductGroup}) {
			return {
				...state,
				currentProductGroup
			}
		}
	},
	effects: {
		* query(_, {call, put}) {
			const data = yield call(productGroupService.query)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(productGroupService.update, payload)
			yield put({
				type: "query"
			})
		},
		* create({payload}, {call, put}) {
			yield call(productGroupService.create, payload)
			yield put({
				type: "query"
			})
		},
		* view({payload}, {call, put}) {
			const {data: productGroup} = yield call(productGroupService.view, payload)
			yield put({
				type: "saveProductGroup",
				payload: productGroup
			})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			history.listen((location) => {
				if (location.pathname === "/dict/product-group") {
					dispatch({
						type: "query"
					})
				}
			})
		}
	}
}
