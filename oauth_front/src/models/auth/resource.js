import * as resourceServie from "../../services/auth/resource"

export default {
	namespace: "resource",
	state: {
		resources: [],
		currentResources: [], // 当前登陆用户所拥有的所有权限
		openedMenus: []
	},
	reducers: {
		saveCurrentResources(state, {payload: currentResources}) {
			return {
				...state,
				currentResources
			}
		},
		saveResources(state, {payload: resources}) {
			return {
				...state,
				resources
			}
		},
		saveOpenedMenus(state, {payload: openedMenus}) {
			return {
				...state,
				...openedMenus
			}
		}
	},
	effects: {
		* queryCurrentResources(_, {call, put}) {
			const result = yield call(resourceServie.currentResources)
			const resources = result.data
			yield put({type: "saveCurrentResources", payload: resources})
		},
		* queryResources(_, {call, put}) {
			const result = yield call(resourceServie.resources)
			const resources = result.data
			yield put({type: "saveResources", payload: resources})
		}
	},
	subscriptions: {}
}
