import * as borderTypeService from "../../services/select/borderType"

export default {
	namespace: "selectBorderTypes",
	state: {
		borderTypes: []
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
			const {borderTypes} = yield select(state => state)
			if (borderTypes === undefined || borderTypes.length === 0) {
				const {data} = yield call(borderTypeService.selection)
				yield put({type: "load", payload: {borderTypes: data}})
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
