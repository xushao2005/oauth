import request from "../../utils/request"
import {resourceApi} from "../../constants/api"

export const currentResources = async () => request(
	resourceApi.currentResources, {
		method: "get"
	})

export const resources = async () => request(
	resourceApi.resources, {
		method: "get"
	})
