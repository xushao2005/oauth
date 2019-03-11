import React, {Component} from "react"
import {Form, Input, Modal, Spin} from "antd"
import {patterns, handleReset} from "../../../utils/form"

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
				type: "supplierContact/view",
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
		const {children, title, record} = this.props
		const checkMobileOrTelphone = (rule, value, callback) => {
			if (patterns.telephone.test(value) || patterns.mobile.test(value)) {
				callback()
			} else {
				callback("联系电话无效")
			}
		}
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
          			{children}
        		</span>
				<Modal
					title={title}
					width={500}
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
										label="联系人"
									>
										{getFieldDecorator("contactName", {
											initialValue: record.contactName,
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
										label="职称"
									>
										{getFieldDecorator("professionalTitle", {
											initialValue: record.professionalTitle,
											rules: [{
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="联系电话"
									>
										{getFieldDecorator("contactPhone", {
											initialValue: record.contactPhone,
											rules: [{
												required: true,
												message: "必填"
											}, {
												validator: checkMobileOrTelphone
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="QQ"
									>
										{getFieldDecorator("qq", {
											initialValue: record.qq,
											rules: [{
												pattern: "[1-9]([0-9]{5,11})",
												message: "不符合规则"
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="Email"
									>
										{getFieldDecorator("email", {
											initialValue: record.email,
											rules: [{
												type: "email",
												message: "Email无效"
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
