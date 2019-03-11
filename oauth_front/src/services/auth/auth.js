import request from "../../utils/request"
import {authApi} from "../../constants/api"

export const getAuthModel = async () => request(
	authApi.authModel, {
		method: "get"
	})

export const login = async () => request(
	authApi.login, {
		method: "get"
	})
