/* eslint-disable react/jsx-filename-extension */
import {Tooltip} from "antd"
import React from "react"
import * as customerService from "../../services/customer/customer"
import {PAY_CYCLE_CONSTANTS} from "../../constants/payCycle"
import {CUSTOMER_SERVICE_LEVEL_CONSTANTS} from "../../constants/customerServiceLevel"
import {fileApi} from "../../constants/api"
import {GENDER_CONSTANTS} from "../../constants/gender"
import {YN_CONSTANTS} from "../../constants/YN"
import PLATFORM_CONSTANTS from "../../constants/platform"

export default {
	namespace: "customerLog",
	state: {
		list: []
	},
	reducers: {
		load(state, {payload}) {
			const {list} = payload
			return {
				...state,
				list
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const {data} = yield call(customerService.logs, payload)
			data.forEach((record) => {
				if ((typeof (record.diffs) !== "undefined") && (typeof (record.diffs) === "object")) {
					record.diffs.forEach((it) => {
						if (it.attrValue === "payCycle") {
							it.oldValue = PAY_CYCLE_CONSTANTS.get(it.oldValue)
							it.newValue = PAY_CYCLE_CONSTANTS.get(it.newValue)
						} else if (it.attrValue === "creditLevel") {
							it.oldValue = String.fromCharCode(it.oldValue)
							it.newValue = String.fromCharCode(it.newValue)
						} else if (it.attrValue === "customerServiceLevel") {
							it.oldValue = CUSTOMER_SERVICE_LEVEL_CONSTANTS.get(it.oldValue)
							it.newValue = CUSTOMER_SERVICE_LEVEL_CONSTANTS.get(it.newValue)
						} else if (it.attrValue === "personalCardAttatch"
							|| it.attrValue === "personalCardBackAttatch"
							|| it.attrValue === "corporateCardAttatch"
							|| it.attrValue === "corporateCardBackAttatch"
							|| it.attrValue === "businessLicenceAttatch") {
							if (it.oldValue) {
								const oldPath = `${fileApi.filePath}/${it.oldValue}`
								it.oldValue = (
									<Tooltip key="old" title="请点击右键另存为">
										<img width={200} alt="" src={oldPath}/>
									</Tooltip>
								)
							}
							if (it.newValue) {
								const newPath = `${fileApi.filePath}/${it.newValue}`
								it.newValue = (
									<Tooltip key="old" title="请点击右键另存为"><img key="new" width={200} alt="" src={newPath}/></Tooltip>)
							}
						} else if (it.attrValue === "contractAttatch") {
							if (it.oldValue) {
								const oldPath = `${fileApi.filePath}/${it.oldValue}`
								it.oldValue = (<a key="old" href={oldPath}>下载</a>)
							}
							if (it.newValue) {
								const newPath = `${fileApi.filePath}/${it.newValue}`
								it.newValue = (<a key="new" href={newPath}>下载</a>)
							}
						} else if (it.attrValue === "gender") {
							it.oldValue = GENDER_CONSTANTS.get(it.oldValue)
							it.newValue = GENDER_CONSTANTS.get(it.newValue)
						} else if (it.attrValue === "english") {
							it.oldValue = YN_CONSTANTS.get(it.oldValue)
							it.newValue = YN_CONSTANTS.get(it.newValue)
						} else if (it.attrValue === "asDefault") {
							it.oldValue = YN_CONSTANTS.get(it.oldValue)
							it.newValue = YN_CONSTANTS.get(it.newValue)
						} else if (it.attrValue === "source") {
							it.oldValue = PLATFORM_CONSTANTS.get(it.oldValue)
							it.newValue = PLATFORM_CONSTANTS.get(it.newValue)
						}
					})
				}
			})
			yield put({
				type: "load",
				payload: {
					list: data
				}
			})
		}
	},
	subscriptions: {}
}
