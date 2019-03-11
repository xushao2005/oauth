import React from "react"
import {Popover, Icon, Tag} from "antd"
import styles from "./listPopoverView.less"

/***
组件说明
1.list: 展示列表
2.popoverContent: Array
	0:列表展示字段
	1:popover展示title
	2:popover展示content
***/
const listPopoverView = ({list, currCustomer,
	handleMouseEvent, popoverContent}) => {
	const content = (
		<div>
			<p>{popoverContent[1]}:
				<span className={styles.font}>{currCustomer[popoverContent[2]]}</span></p>
		</div>
	)
	const componentHandleShowMainCustomerPopover = (value) => {
		handleMouseEvent(value)
	}
	return (
		<span>
			{
				list.map(customer => (
					<Popover
						content={content}
						onMouseEnter={componentHandleShowMainCustomerPopover.bind(
							null, customer[popoverContent[0]])}
						key={customer[popoverContent[0]]}
					>
						<Tag>
							{customer[popoverContent[0]]}
							<Icon style={{fontSize: 12, marginLeft: "3px"}} type="question-circle-o"/>
						</Tag>
					</Popover>
				))
			}
		</span>
	)
}

export default listPopoverView

