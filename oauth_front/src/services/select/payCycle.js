import request from "../../utils/request"
import {payCycleApi} from "../../constants/api"

export const selection = async () => request(
	payCycleApi.payCycleSelection, {
		method: "get"
	})
