import React from "react"
import BigNumber from "bignumber.js"

export default ({money}) => {
	if (money === undefined) {
		return (
			<span/>
		)
	}
	let fontColor
	if (money < 0) {
		fontColor = "green"
	} else if (money > 0) {
		fontColor = "red"
	} else {
		fontColor = "black"
	}
	return (
		<span style={{color: fontColor}}>{new BigNumber(money).toFormat(2)}</span>
	)
}
