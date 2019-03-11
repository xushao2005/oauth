import React, {Component} from "react"
import {Form, Input, Modal, Spin} from "antd"
import {checkUniqueAccountNumber} from "../../../validators/supplier/supplierFinance"
import {handleReset, patterns} from "../../../utils/form"

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}
	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		if (payload) {
			dispatch({
				type: "supplierFinance/view",
				payload: payload
			})
		}
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		if (this.props.record.id === undefined) {
			handleReset(this.props.form)
		}
		this.setState({
			visible: false
		})
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				onOk(values)
				this.hideModelHandler()
			}
		})
	}

	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 4}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 20}
			},
			style: {
				maxWidth: 600,
				margin: "16px auto"
			}
		}
		const {getFieldDecorator} = this.props.form
		const {children, title, record, payload} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		const checkUniqueAccountNumberInter = (rule, value, callback) => {
			const {supplierCode} = record
			const id = payload ? payload.id : null
			const values = {
				id: id,
				supplierCode,
				accountNumber: value
			}
			checkUniqueAccountNumber(rule, values, callback)
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					width={600}
					confirmLoading={confirmLoading}
					visible={this.state.visible && !confirmLoading}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
				>
					<Form>
						<Spin spinning={viewLoading}>
							{!viewLoading &&
								<div>
									<Form.Item
										{...formItemLayout}
										label="银行账户名"
									>
										{getFieldDecorator("name", {
											initialValue: record.name,
											rules: [{
												required: true,
												message: "必填"
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="银行账号"
									>
										{getFieldDecorator("accountNumber", {
											initialValue: record.accountNumber,
											rules: [{
												required: true,
												message: "必填"
											}, {
												pattern: /^[\dA-Z]+$/,
												message: "只支持输入数字和大写字母"
											}, {
												validator: checkUniqueAccountNumberInter
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="开户行"
									>
										{getFieldDecorator("bankName", {
											initialValue: record.bankName,
											rules: [{
												required: true,
												message: "必填"
											}]
										})(
											<Input/>)
										}
									</Form.Item>
								</div>
							}
						</Spin>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
