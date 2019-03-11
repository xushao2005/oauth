import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierTransportContractApi} from "../../constants/api"

export const query = async params => request(
	supplierTransportContractApi.contracts, {
		method: "get",
		data: params
	})

export const create = async params => request(
	supplierTransportContractApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierTransportContractApi.update, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(supplierTransportContractApi.remove).stringify(params), {
		method: "delete"
	})

export const view = async params => request(
	new UrlPattern(supplierTransportContractApi.view).stringify(params), {
		method: "get"
	})

export const uniqueContractCode = async params => request(
	supplierTransportContractApi.uniqueContractCode, {
		method: "get",
		data: params
	})

export const conflictedActiveTime = async params => request(
	supplierTransportContractApi.conflictedActiveTime, {
		method: "get",
		data: params
	})
