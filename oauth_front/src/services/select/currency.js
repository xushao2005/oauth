import request from "../../utils/request"
import {currencyApi} from "../../constants/api"

export const selection = async () => request(
	currencyApi.currencySelection, {
		method: "get"
	})
