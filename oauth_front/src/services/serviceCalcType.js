import UrlPattern from "url-pattern"
import request from "../utils/request"
import {serviceCalcTypeApi} from "../constants/api"

export const selection = async () => request(
	serviceCalcTypeApi.serviceTypeSelection, {
		method: "get"
	}
)
