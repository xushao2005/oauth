import * as currencyService from "../../services/select/currency"

export default {
	namespace: "selectCurrency",
	state: {
		currencies: []
	},
	reducers: {
		saveCurrencies(state, {payload: currencies}) {
			return {
				...state,
				currencies
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectCurrency} = yield select(state => state)
			if (selectCurrency.currencies.length === 0) {
				const {data} = yield call(currencyService.selection)
				yield put({type: "saveCurrencies", payload: data})
			}
		}
	},
	subscriptions: {}
}
