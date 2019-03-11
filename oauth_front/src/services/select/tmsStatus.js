import request from "../../utils/request"
import {tmsStatusApi} from "../../constants/api"

export const selection = async () => request(
	tmsStatusApi.tmsStatusSelection, {
		method: "get"
	})
