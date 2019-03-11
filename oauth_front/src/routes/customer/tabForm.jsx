import React, {Component} from "react"
import {Modal, Button, Row, Col} from "antd"

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			isShowPersonalBtn: false,
			isShowCompanyBtn: false
		}
	}

	showModelHandler = (e) => {
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}
	okHandler = () => {
		const {currentCustomer, onOk} = this.props
		const params = {customerCode: currentCustomer.customerCode}
		if (this.state.isShowPersonalBtn) {
			params.customerType = 0
		}
		if (this.state.isShowCompanyBtn) {
			params.customerType = 1
		}
		onOk(params)
		this.hideModelHandler()
	}

	render() {
		const {children, title} = this.props
		const init = (n) => {
			if (n === 1) {
				this.setState({
					isShowPersonalBtn: true,
					isShowCompanyBtn: false
				})
			}
			if (n === 2) {
				this.setState({
					isShowPersonalBtn: false,
					isShowCompanyBtn: true
				})
			}
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					margin="0 auto"
					maskClosable={false}
					visible={this.state.visible}
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
				>
					<Row style={{margin: "20px 0"}}>
						<Col span={4} offset={7}>
							<Button size="large" type={this.state.isShowPersonalBtn ? "primary" : "default"} onClick={init.bind(null, 1)}>个人用户</Button>
						</Col>
						<Col span={4} offset={2}>
							<Button size="large" type={this.state.isShowCompanyBtn ? "primary" : "default"} onClick={init.bind(null, 2)}>企业用户</Button>
						</Col>
					</Row>
				</Modal>
			</span>
		)
	}
}

export default FormModal
