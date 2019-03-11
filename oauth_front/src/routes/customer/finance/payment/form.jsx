import React, {Component} from "react"
import {Form, Input, Modal, Radio, Select, Spin} from "antd"
import {handleReset, patterns} from "../../../../utils/form"
import {checkUniquePayment} from "../../../../validators/customer/customerFinance"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const Option = Select.Option

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			payment: 0
		}
	}

	onPaymentChange = (e) => {
		this.setState({payment: e.target.value},
			() => {
				this.props.form.validateFields(["bankCard"], {force: true})
			})
	}
	showModelHandler = (e) => {
		const {record} = this.props
		let payment = 0
		if (record.payment) {
			payment = record.payment
		}
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true,
			payment: payment
		})
	}
	hideModelHandler = () => {
		const {record, form} = this.props
		if (record.id === undefined) {
			handleReset(form)
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
	checkPayment = (rule, value, callback) => {
		const payment = this.state.payment || 0
		if (!value) {
			callback()
		} else if (payment === 0 && !patterns.bankcard.test(value)) {
			callback("请输入正确的银行卡号")
		} else if (payment === 1 && !(patterns.character.test(value)
			|| patterns.mobile.test(value)
			|| patterns.email.test(value))) {
			callback("请输入正确的支付宝账户")
		} else {
			const values = {
				bankCard: value,
				customerCode: this.props.customerCode,
				payment: this.state.payment || 0,
				id: this.props.record && this.props.record.id ? this.props.record.id : undefined
			}
			checkUniquePayment(rule, values, callback)
			// callback()
		}
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
		const {children, title, record, bankSelection} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		const bankOptions = bankSelection
			? bankSelection.map(item =>
				(<Option key={item.id}>{item.name}</Option>))
			: []
		const filterOption = (input, option) =>
			option.props.children.toLowerCase()
				.indexOf(input.toLowerCase()) >= 0
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible && <Modal
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
									label="付款方式"
								>
									{getFieldDecorator("payment", {
										initialValue: record.payment,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
											onChange={this.onPaymentChange}
										>
											{
												((record.id === undefined)
												|| (record.id !== undefined && record.payment === 0)) &&
												<RadioButton value={0}>银行</RadioButton>}
											{
												((record.id === undefined)
												|| (record.id !== undefined && record.payment === 1)) &&
												<RadioButton value={1}>支付宝</RadioButton>}
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="银行卡号/付款账号"
								>
									{getFieldDecorator("bankCard", {
										initialValue: record.bankCard,
										rules: [{
											required: true,
											message: "必填"
										}, {
											validator: this.checkPayment
										}]
									})(
										<Input/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="姓名"
								>
									{getFieldDecorator("bankAccount", {
										initialValue: record.bankAccount,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Input/>)
									}
								</Form.Item>
								{this.state.payment === 0 &&
								<Form.Item
									{...formItemLayout}
									label="银行"
								>
									{getFieldDecorator("bankCode", {
										initialValue: record.bankCode,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select showSearch filterOption={filterOption}>
											{bankOptions}
										</Select>)
									}
								</Form.Item>}
								{this.state.payment === 0 &&
								<Form.Item
									{...formItemLayout}
									label="开户行"
								>
									{getFieldDecorator("depositBank", {
										initialValue: record.depositBank,
									})(
										<Input/>)
									}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="是否默认"
								>
									{getFieldDecorator("defaultPay", {
										initialValue: String(record.defaultPay || false)
									})(
										<RadioGroup>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>
							</div>
							}
						</Spin>
					</Form>
				</Modal>}
			</span>
		)
	}
}

export default Form.create()(FormModal)
