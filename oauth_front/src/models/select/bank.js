import * as bankService from "../../services/bank"

export default {
	namespace: "selectBank",
	state: {
		banks: [],
	},
	reducers: {
		saveBanks(state, {payload: banks}) {
			return {
				...state,
				banks
			}
		},
	},
	effects: {
		* selection(_, {call, put}) {
			const {data} = yield call(bankService.selection)
			yield put({type: "saveBanks", payload: data})
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			dispatch({type: "selection"})
		}
	}
}
