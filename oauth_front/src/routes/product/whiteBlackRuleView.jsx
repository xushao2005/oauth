import React, {Component} from "react"
import {Modal, Button, Form} from "antd"

class WhiteBlackRuleView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
		}
	}
	showModelHandler = () => {
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}
	render() {
		const {children, title, r} = this.props
		const modalProps = {
			closable: false,
			title: title,
			visible: this.state.visible,
			footer: (<Button onClick={this.hideModelHandler} type="primary">关闭</Button>),
		}
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 6}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 18}
			},
			style: {
				// maxWidth: 600,
				margin: "16px 20px"
			}
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal {...modalProps}>
					<Form>
						<Form.Item
							{...formItemLayout}
							label="规则名">
							<span>{r.name}</span>
						</Form.Item>
					</Form>
					<Form.Item
						{...formItemLayout}
						label="规则类型"
					>
						<span>{r.mode === "white" ? "白名单" : "黑名单"}</span>
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="客户号名单"
					>
						<span>{r.whiteBlackListCustomersNames}</span>
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="是否全部国家"
					>
						<span>{r.allCountries ? "是" : "否"}</span>
					</Form.Item>
					{!r.allCountries && <Form.Item
						{...formItemLayout}
						label="国家名单"
					>
						<span>{r.countriesNames}</span>
					</Form.Item>}
				</Modal>
			</span>
		)
	}
}

export default WhiteBlackRuleView
