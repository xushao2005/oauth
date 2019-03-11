import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {customerContractApi} from "../../constants/api"

export const query = async params => request(
	new UrlPattern(customerContractApi.get).stringify(params), {
		method: "get",
		data: params.query
	})

// 检测合同号是否重复
export const uniqueContractCode = async params => request(
	customerContractApi.uniqueContractCode, {
		method: "get",
		data: params
	}
)

// 检测合同生效时间是否合法
export const conflictedActiveTime = async params => request(
	customerContractApi.conflictedActiveTime, {
		method: "get",
		data: params
	}
)

export const create = async params => request(
	customerContractApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	customerContractApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(customerContractApi.remove).stringify(params), {
		method: "delete",
		data: params.query
	})
