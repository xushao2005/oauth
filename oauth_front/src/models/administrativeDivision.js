import * as administrativeDivisionService from "../services/region/administrativeDivision"

const generateDistrictTree = (currents, chinaDistricts) => currents.map((it) => {
	const node = {
		value: String(it.administrativeCode),
		label: it.nameCn
	}
	const children = chinaDistricts.filter(child => child.parentId === it.id)
	if (children && children.length > 0) {
		node.children = generateDistrictTree(children, chinaDistricts)
	}
	return node
})

const generateDistrictRawTree = (currents, chinaDistricts) => currents.map((it) => {
	const node = {
		value: it.nameCn,
		label: it.nameCn
	}
	const children = chinaDistricts.filter(child => child.parentId === it.id)
	if (children && children.length > 0) {
		node.children = generateDistrictRawTree(children, chinaDistricts)
	}
	return node
})

const generateDistrictTreeEn = (currents, chinaDistricts) => currents.map((it) => {
	const node = {
		value: String(it.administrativeCode),
		label: it.nameEn
	}
	const children = chinaDistricts.filter(child => child.parentId === it.id)
	if (children && children.length > 0) {
		node.children = generateDistrictTreeEn(children, chinaDistricts)
	}
	return node
})

export default {
	namespace: "administrativeDivision",
	state: {
		list: [],
		chinaDistricts: [],
		generateDistrictRaw: [],
		chinaDistrictCodes: [],
		chinaDistrictPinyinCodes: [],
		divisionOptions: []
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		},
		loadChinaDistricts(state, {payload}) {
			const {chinaDistricts} = payload
			return {
				...state,
				chinaDistricts
			}
		},
		loadChinaDistrictCodes(state, {payload}) {
			const {generateDistrictRaw, chinaDistrictCodes, chinaDistrictPinyinCodes} = payload
			return {
				...state,
				generateDistrictRaw,
				chinaDistrictCodes,
				chinaDistrictPinyinCodes
			}
		},
		resetChinaDistrict(state) {
			return {
				...state,
				chinaDistricts: []
			}
		},
		reset(state) {
			return {
				...state,
				list: []
			}
		},
		store(state, {payload}) {
			return {
				...state,
				...payload
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(administrativeDivisionService.getAll, payload)
			yield put({
				type: "load",
				payload: {
					list: data.data
				}
			})
		},
		* create({payload}, {call, put}) {
			yield call(administrativeDivisionService.create, payload)
			yield put({
				type: "query",
				payload: {
					regionId: payload.regionId
				}
			})
			if (payload.regionId === "8") {
				yield put({
					type: "resetChinaDistrict"
				})
			}
		},
		* update({payload}, {call, put}) {
			yield call(administrativeDivisionService.update, payload)
			yield put({
				type: "query",
				payload: {
					regionId: payload.regionId
				}
			})
			if (payload.regionId === "8") {
				yield put({
					type: "resetChinaDistrict"
				})
			}
		},
		* remove({payload}, {call, put}) {
			yield call(administrativeDivisionService.remove, payload)
			yield put({
				type: "query",
				payload: {
					regionId: payload.regionId
				}
			})
			if (payload.regionId === "8") {
				yield put({
					type: "resetChinaDistrict"
				})
			}
		},
		* initSelectDistricts(_, {call, select, put}) {
			const {administrativeDivision} = yield select(state => state)
			if (administrativeDivision.chinaDistricts.length === 0) {
				const {data} = yield call(administrativeDivisionService.getAll, {regionId: "8"})
				yield put({
					type: "loadChinaDistricts",
					payload: {
						chinaDistricts: data
					}
				})
				const dataCn = generateDistrictTree(data.filter(it => it.parentId === undefined), data)
				const dataEn = generateDistrictTreeEn(
					data.filter(it => it.parentId === undefined), data)
				const generateDistrictRaw = generateDistrictRawTree(
					data.filter(it => it.parentId === undefined), data)
				yield put({
					type: "loadChinaDistrictCodes",
					payload: {
						generateDistrictRaw,
						chinaDistrictCodes: dataCn,
						chinaDistrictPinyinCodes: dataEn
					}
				})
			}
		},
		* options({payload}, {call, put}) {
			const {data} = yield call(administrativeDivisionService.options, payload)
			yield put({
				type: "store",
				payload: {
					divisionOptions: data
				}
			})
		}
	},
	subscriptions: {}
}
