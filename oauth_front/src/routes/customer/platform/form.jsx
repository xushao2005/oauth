import React, {Component} from "react"
import {Form, Input, Modal, Spin, Radio} from "antd"
import {checkUniquePlatformCode} from "../../../validators/customer/customerPlatform"
import {handleReset} from "../../../utils/form"
import PLATFORM_CONSTANTS from "../../../constants/platform"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			customerPlam: 1
		}
	}

	onCustomerPlamChange = (e) => {
		this.setState({customerPlam: e.target.value},
			() => {
				this.props.form.validateFields(["plamCode"], {force: true})
			})
	}
	showModelHandler = (e) => {
		const {record} = this.props
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true,
			customerPlam: record.customerPlam || 1
		})
	}
	hideModelHandler = () => {
		const {record, form} = this.props
		if (record.id === undefined) {
			handleReset(form, {customerPlam: 1})
		}
		this.setState({
			visible: false
		})
	}
	checkUniquePlatformCodeInternal = (rule, value, callback) => {
		const {record} = this.props
		const id = record.id
		const values = {
			id: id,
			customerPlam: this.state.customerPlam || 1,
			plamCode: value
		}
		checkUniquePlatformCode(rule, values, callback)
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
				sm: {span: 7}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 17}
			},
			style: {
				margin: "16px auto"
			}
		}
		const {getFieldDecorator} = this.props.form
		const {children, title, record} = this.props
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
					width={800}
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
									label="销售平台"
								>
									{getFieldDecorator("customerPlam", {
										initialValue: record.customerPlam || 1,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
											onChange={this.onCustomerPlamChange}
										>
											{Array.from(PLATFORM_CONSTANTS).map(([key, value]) =>
												<RadioButton key={key} value={key}>{value}</RadioButton>
											)}
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="平台客户号"
								>
									{getFieldDecorator("plamCode", {
										initialValue: record.plamCode,
										rules: [{
											required: true,
											message: "必填"
										}, {
											type: "string",
											pattern: "^[\x01-\x7f]*$",
											message: "请输入正确的平台客户号"
										}, {
											validator: this.checkUniquePlatformCodeInternal
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
