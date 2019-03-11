import React, {Component} from "react"
import {Modal, Form, Input} from "antd"
import {checkUniqueKey, checkUniqueValue} from "../../../validators/paymentCompany"
import {handleReset, patterns} from "../../../utils/form"

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}
	showModelHandler = (e) => {
		if (e) e.preventDefault()
		this.setState({
			visible: true
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
	hideModelHandler = () => {
		if (this.props.record.id === undefined) {
			handleReset(this.props.form)
		}
		this.setState({
			visible: false
		})
	}
	render() {
		const {getFieldDecorator} = this.props.form
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 7}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 17}
			}
		}
		const {children, title, record} = this.props
		let {confirmLoading, resourcesLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (resourcesLoading === undefined) {
			resourcesLoading = false
		}
		// 编码校验
		const checkUniqueKeyInternal = (rule, value, callback) => {
			if (patterns.positiveInteger.test(value)) {
				const values = {id: value}
				checkUniqueKey(rule, values, callback)
			} else {
				callback("必须为数字且首位不能为零")
			}
		}
		// 名称校验
		const checkUniqueValueInternal = (rule, value, callback) => {
			const values = {
				name: value,
				id: record.id
			}
			checkUniqueValue(rule, values, callback)
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					width={400}
					confirmLoading={confirmLoading}
					visible={this.state.visible}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					maskClosable={false}
				>
					<Form>
						{!record.id
							&& <Form.Item
								{...formItemLayout}
								label="编码"
							>
								{
									getFieldDecorator("id", {
										initialValue: record.id,
										rules: [{
											required: true,
											message: "必填"
										}, {
											validator: checkUniqueKeyInternal
										}]
									})(<Input/>)
								}
							</Form.Item>
						}
						<Form.Item
							{...formItemLayout}
							label="名称"
						>
							{
								getFieldDecorator("name", {
									initialValue: record.name,
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										pattern: /^[()\w-.\u4e00-\u9fa5]+$/,
										message: "中文名称不能含有特殊符号"
									}, {
										validator: checkUniqueValueInternal
									}]
								})(<Input/>)
							}
						</Form.Item>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
