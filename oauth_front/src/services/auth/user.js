import UrlPattern from "url-pattern"
import request from "../../utils/request"
import {userApi} from "../../constants/api"

export const login = async params => request(
	userApi.login, {
		method: "post",
		data: params
	})

export const logout = async () => request(
	userApi.logout, {
		method: "delete"
	})

export const current = async () => request(
	userApi.currentUser, {
		method: "get"
	})

export const query = async params => request(
	userApi.users, {
		method: "get",
		data: params
	})

export const create = async params => request(
	userApi.create, {
		method: "post",
		data: params
	})

export const update = async params => request(
	userApi.update, {
		method: "put",
		data: params
	})

export const view = async params => request(
	new UrlPattern(userApi.view).stringify(params), {
		method: "get"
	})

export const roles = async params => request(
	new UrlPattern(userApi.roles).stringify(params), {
		method: "get"
	})
