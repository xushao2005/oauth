import * as regionService from "../../services/region/region"

export default {
	namespace: "selectRegion",
	state: {
		regions: [],
		searchReginons: []
	},
	reducers: {
		saveRegions(state, {payload: regions}) {
			return {
				...state,
				regions
			}
		},
		searchReginons(state, {regions}) {
			return {
				...state,
				searchReginons: regions
			}
		}
	},
	effects: {
		* selection({payload}, {call, put}) {
			if (payload.p) {
				const {data} = yield call(regionService.selection, payload)
				yield put({type: "saveRegions", payload: data})
			}
		}
	},
	subscriptions: {}
}
