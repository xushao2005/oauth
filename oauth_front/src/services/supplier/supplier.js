import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {supplierApi} from "../../constants/api"

export const query = async params => request(
	supplierApi.suppliers, {
		method: "get",
		data: params
	})

export const selection = async params => request(
	supplierApi.autoComplete, {
		method: "get",
		data: params
	})

// 自动完成供应商付款账户信息补全
export const autoCompleteSupplierAccount = async params => request(
	supplierApi.autoCompleteSupplierAccount, {
		method: "get",
		data: params
	})

export const create = async params => request(
	supplierApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	supplierApi.update, {
		method: "put",
		data: params
	})

export const updatePaymentInfo = async params => request(
	supplierApi.updatePaymentInfo, {
		method: "put",
		data: params
	})

export const updatePayment = async params => request(
	supplierApi.updatePayment, {
		method: "put",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(supplierApi.remove).stringify(params), {
		method: "delete"
	})

export const view = async params => request(
	new UrlPattern(supplierApi.view).stringify(params), {
		method: "get"
	})

export const uniqueCode = async params => request(
	supplierApi.uniqueCode, {
		method: "get",
		data: params
	})

export const uniqueNameCh = async params => request(
	supplierApi.uniqueNameCh, {
		method: "get",
		data: params
	})

export const uniqueBusinessLicence = async params => request(
	supplierApi.uniqueBusinessLicence, {
		method: "get",
		data: params
	})

export const nextCode = async () => request(
	supplierApi.nextCode, {
		method: "get"
	}
)
