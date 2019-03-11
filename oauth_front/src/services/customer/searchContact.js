import request from "../../utils/request"
import {customerApi} from "../../constants/api"

export const searchByContact = async params => request(
	customerApi.searchByContact, {
		method: "get",
		data: params
	}
)
