import * as administrativeDivisionService from "../services/region/administrativeDivision"

export const checkUniqueAdministrativeCode = async (rule, values, callback) => {
	if (!values.administrativeCode) {
		callback()
	} else {
		const {data} = await administrativeDivisionService.ifNotExistAdministrativeCode(values)
		if (data === true) {
			callback()
		} else {
			callback("该行政区域编码已被使用")
		}
	}
}
