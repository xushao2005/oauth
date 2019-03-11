import * as areaLevelService from "../../services/select/areaLevel"

export default {
	namespace: "selectAreaLevel",
	state: {
		selects: []
	},
	reducers: {
		save(state, {payload: selects}) {
			return {
				...state,
				selects
			}
		}
	},
	effects: {
		* selection(_, {call, select, put}) {
			const {selectAreaLevel} = yield select(state => state)
			if (selectAreaLevel.selects.length === 0) {
				const {data} = yield call(areaLevelService.selection)
				yield put({type: "save", payload: data})
			}
		}
	},
	subscriptions: {}
}
