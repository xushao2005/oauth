import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {regionApi} from "../../constants/api"

export const query = async params => request(
	regionApi.regions, {
		method: "get",
		data: params
	})

export const selection = async params => request(
	regionApi.autoComplete, {
		method: "get",
		data: params
	})

export const create = async params => request(
	regionApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	regionApi.update, {
		method: "put",
		data: params
	})

export const view = async params => request(
	new UrlPattern(regionApi.view).stringify(params), {
		method: "get"
	})

