import * as companyService from "../../services/select/company"

export default {
	namespace: "selectCompany",
	state: {
		companies: []
	},
	reducers: {
		saveCompanies(state, {payload: companies}) {
			return {
				...state,
				companies
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectCompany} = yield select(state => state)
			if (selectCompany.companies.length === 0) {
				const {data} = yield call(companyService.selection)
				yield put({type: "saveCompanies", payload: data})
			}
		}
	},
	subscriptions: {}
}
