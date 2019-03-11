import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerApi} from "../../constants/api"

export const query = async params => request(
	customerApi.get, {
		method: "get",
		data: params
	}
)

export const create = async params => request(
	customerApi.create, {
		method: "post",
		data: params
	}
)

export const update = async params => request(
	customerApi.update, {
		method: "put",
		data: params
	})

export const updateFinance = async params => request(
	customerApi.updateFinance, {
		method: "put",
		data: params
	})

export const view = async params => request(
	new UrlPattern(customerApi.view).stringify(params), {
		method: "get"
	}
)

export const nextCustomerCode = async params => request(
	new UrlPattern(customerApi.nextCustomerCode).stringify(params), {
		method: "post"
	}
)

export const checkIntegrity = async params => request(
	new UrlPattern(customerApi.lackOfIntegrity).stringify(params), {
		method: "get"
	}
)

// 初始化
export const customerInitVo = async params => request(
	customerApi.init, {
		method: "put",
		data: params
	}
)

// 转正
export const customerSignVo = async params => request(
	customerApi.sign, {
		method: "put",
		data: params
	}
)

// 解冻
export const customerAutoDefrostVo = async params => request(
	customerApi.autoDefrost, {
		method: "put",
		data: params
	}
)

// 客户名唯一性验证
export const uniqueNameCh = async params => request(
	customerApi.uniqueName, {
		method: "get",
		data: params
	})

export const validPayAccount = async params => request(
	customerApi.validPayAccount, {
		method: "get",
		data: params
	})

export const checkCheckingCode = async params => request(
	customerApi.uniqueCheckingCode, {
		method: "get",
		data: params
	}
)

export const checkIntroducerCode = async params => request(
	customerApi.uniqueIntroduerCode, {
		method: "get",
		data: params
	}
)

// 获取主付款客户或者关联客户列表
export const mainAccounts = async params => request(
	customerApi.mainAccounts, {
		method: "get",
		data: params
	}
)

export const logs = async params => request(
	new UrlPattern(customerApi.logs).stringify(params), {
		method: "get"
	}
)

export const changeToPersonal = async params => request(
	customerApi.changeToPersonal, {
		method: "put",
		data: params
	}
)

export const changeToCompany = async params => request(
	customerApi.changeToCompany, {
		method: "put",
		data: params
	}
)

export const ejfStatusFrozen = async params => request(
	new UrlPattern(customerApi.ejfStatusFrozen).stringify(params), {
		method: "put"
	}
)

export const adminPhoneExists = async params => request(
	customerApi.adminPhoneExists, {
		method: "get",
		data: params
	}
)
