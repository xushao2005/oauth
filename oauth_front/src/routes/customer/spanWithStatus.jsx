import React from "react"
import {Tag} from "antd"
import moment from "moment/moment"

export default (text, record = {}) => {
	let status
	let color
	if (record.invalidTime) {
		if (moment(record.invalidTime).isBefore(moment())) {
			status = "失效"
			color = "grey"
		} else if (moment(record.effectTime).isBefore(moment())) {
			status = "生效"
			color = "green"
		} else {
			status = "待生效"
			color = "cyan"
		}
	} else if (moment(record.effectTime).isBefore(moment())) {
		status = "生效"
		color = "green"
	} else {
		status = "待生效"
		color = "cyan"
	}
	return (
		<span>
			<Tag color={color}>{status}</Tag>{text}
		</span>
	)
}
