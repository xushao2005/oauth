import request from "../../utils/request"
import {companyApi} from "../../constants/api"

export const selection = async () => request(
	companyApi.companySelection, {
		method: "get"
	})
