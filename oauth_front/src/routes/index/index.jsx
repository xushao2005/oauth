import React from "react"
import {connect} from "dva"

const Index = () => (
	<div className="culture-inner">
		<img
			alt="助力客户成功，成为具有领先地位的中国跨境出口物流及供应链服务企业"
			src="/culture.png"
			className="culture"/>
	</div>
)

export default connect()(Index)
