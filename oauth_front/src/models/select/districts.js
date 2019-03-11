import rawDistricts from "../../constants/districts.json"
import rawDistrictPinyins from "../../constants/districtPinyins.json"

const generateDistrictChildren = (raw, code, mode, type = "city") => {
	const children = []
	const data = raw[code]
	for (const codeKey in data) {
		if ({}.hasOwnProperty.call(data, codeKey)) {
			const codeLabel = data[codeKey]
			const child = {}
			if (mode === "label") {
				child.value = codeLabel
			} else {
				child.value = codeKey
			}
			child.label = codeLabel
			if (type === "city") {
				child.children = generateDistrictChildren(raw, codeKey, mode, "area")
			}
			children.push(child)
		}
	}
	return children
}

export default {
	namespace: "selectDistricts",
	state: {
		districts: [],
		districtCodes: [],
		districtPinyinCodes: []
	},
	reducers: {
		load(state) {
			if (state.districts.length === 0) {
				const alphabetMap = rawDistricts[86]
				const districts = []
				const districtCodes = []
				for (const alphabetKey in alphabetMap) {
					if ({}.hasOwnProperty.call(alphabetMap, alphabetKey)) {
						alphabetMap[alphabetKey].forEach((item) => {
							const province = {}
							province.label = item.address
							province.value = item.address
							province.children = generateDistrictChildren(rawDistricts, item.code, "label")
							districts.push(province)
							const provinceCode = {}
							provinceCode.label = item.address
							provinceCode.value = item.code
							provinceCode.children = generateDistrictChildren(rawDistricts, item.code, "code")
							districtCodes.push(provinceCode)
						})
					}
				}
				const pinyinMap = rawDistrictPinyins[86]
				const districtPinyinCodes = []
				for (const pinyinKey in pinyinMap) {
					if ({}.hasOwnProperty.call(pinyinMap, pinyinKey)) {
						pinyinMap[pinyinKey].forEach((item) => {
							const province = {}
							province.label = item.address
							province.value = item.code
							province.children = generateDistrictChildren(rawDistrictPinyins, item.code, "code")
							districtPinyinCodes.push(province)
						})
					}
				}
				return {
					...state,
					districts,
					districtCodes,
					districtPinyinCodes
				}
			} else {
				return state
			}
		}
	},
	effects: {},
	subscriptions: {
		setup({dispatch}) {
			dispatch({type: "load"})
		}
	}
}
