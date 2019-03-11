import * as serviceService from "../../services/select/service"

export default {
	namespace: "selectService",
	state: {
		services: []
	},
	reducers: {
		saveServices(state, {payload: services}) {
			return {
				...state,
				services
			}
		}
	},
	effects: {
		* selection({payload}, {call, put}) {
			const {data} = yield call(serviceService.selection, payload)
			yield put({type: "saveServices", payload: data})
		}
	},
	subscriptions: {}
}
