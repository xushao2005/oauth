import request from "../../utils/request"
import {ejfStatusApi} from "../../constants/api"

export const selection = async () => request(
	ejfStatusApi.ejfStatusSelection, {
		method: "get"
	})
