import rawDistricts from "../constants/districts.json"
import rawDistrictPinyins from "../constants/districtPinyins.json"

export const findProvince = (provinceCode) => {
	const alphabetMap = rawDistricts[86]
	for (const alphabetKey in alphabetMap) {
		if ({}.hasOwnProperty.call(alphabetMap, alphabetKey)) {
			for (const item of alphabetMap[alphabetKey]) {
				if (provinceCode === item.code) {
					return item.address
				}
			}
		}
	}
	return undefined
}

export const findProvincePinyin = (provinceCode) => {
	const alphabetMap = rawDistrictPinyins[86]
	for (const alphabetKey in alphabetMap) {
		if ({}.hasOwnProperty.call(alphabetMap, alphabetKey)) {
			for (const item of alphabetMap[alphabetKey]) {
				if (provinceCode === item.code) {
					return item.address
				}
			}
		}
	}
	return undefined
}

export const findDistrict = (parentCode, code) => {
	const rawParents = rawDistricts[parentCode]
	return rawParents[code]
}

export const findDistrictPinyin = (parentCode, code) => {
	const rawParents = rawDistrictPinyins[parentCode]
	return rawParents[code]
}
