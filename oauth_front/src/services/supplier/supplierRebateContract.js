import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierRebateContractApi} from "../../constants/api"

export const query = async params => request(
	supplierRebateContractApi.contracts, {
		method: "get",
		data: params
	})

export const create = async params => request(
	supplierRebateContractApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierRebateContractApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(supplierRebateContractApi.remove).stringify(params), {
		method: "delete"
	})

export const view = async params => request(
	new UrlPattern(supplierRebateContractApi.view).stringify(params), {
		method: "get"
	})

export const uniqueContractCode = async params => request(
	supplierRebateContractApi.uniqueContractCode, {
		method: "get",
		data: params
	})

export const conflictedActiveTime = async params => request(
	supplierRebateContractApi.conflictedActiveTime, {
		method: "get",
		data: params
	})
