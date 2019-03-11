import request from "../../utils/request"
import {customerApi} from "../../constants/api"

export const saleOrReceiverOps = async params => request(
	customerApi.saleOrReceiverOps, {
		method: "post",
		data: params
	}
)

export const changelogMetric = async () => request(
	customerApi.changelogMetric, {
		method: "get"
	}
)

export const changeDetailMetric = async () => request(
	customerApi.changeDetailMetric, {
		method: "get"
	}
)

export const queryChangelog = async params => request(
	customerApi.queryChangelog, {
		method: "get",
		data: params
	}
)

const ejfStatusApi = {
	0: "ejfStatusOpsNotActive",
	1: "ejfStatusOpsActive",
	2: "ejfStatusOpsFrozen"
}

export const ejfStatusOps = async params => request(
	customerApi[ejfStatusApi[params.ejfStatus]], {
		method: "post",
		data: params
	}
)

const tmsStatuApi = {
	1: "tmsStatusOpsActive",
	2: "tmsStatusOpsInActive",
	3: "tmsStatusOpsFrozen",
	4: "tmsStatusOpsWaitForRecipt",
	5: "tmsStatusOpsWaitForDefrost"
}

export const tmsStatusOps = async params => request(
	customerApi[tmsStatuApi[params.tmsStatus]], {
		method: "post",
		data: params
	}
)

