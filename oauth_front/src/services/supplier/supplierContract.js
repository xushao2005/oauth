import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierContractApi} from "../../constants/api"

export const query = async params => request(
	supplierContractApi.contracts, {
		method: "get",
		data: params
	})

export const create = async params => request(
	supplierContractApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierContractApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(supplierContractApi.remove).stringify(params), {
		method: "delete"
	})

export const view = async params => request(
	new UrlPattern(supplierContractApi.view).stringify(params), {
		method: "get"
	})

export const uniqueContractCode = async params => request(
	supplierContractApi.uniqueContractCode, {
		method: "get",
		data: params
	})

export const conflictedActiveTime = async params => request(
	supplierContractApi.conflictedActiveTime, {
		method: "get",
		data: params
	})
