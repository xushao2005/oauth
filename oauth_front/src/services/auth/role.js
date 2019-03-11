import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {roleApi} from "../../constants/api"

export const query = async params => request(
	roleApi.roles, {
		method: "get",
		data: params
	})

export const remove = async params => request(
	new UrlPattern(roleApi.remove).stringify(params), {
		method: "delete"
	})

export const create = async params => request(
	roleApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	roleApi.update, {
		method: "put",
		data: params
	})

export const view = async params => request(
	new UrlPattern(roleApi.view).stringify(params), {
		method: "get"
	})

export const resources = async params => request(
	new UrlPattern(roleApi.resources).stringify(params), {
		method: "get"
	})

export const currentRoles = async () => request(
	roleApi.currentRoles, {
		method: "get"
	})
