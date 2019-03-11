import request from "../../utils/request"
import {areaLevelApi} from "../../constants/api"

export const selection = async () => request(
	areaLevelApi.areaLevelSelection, {
		method: "get"
	})
