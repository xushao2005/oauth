import React, {Component} from "react"
import moment from "moment"
import {AutoComplete, DatePicker, Form, Modal} from "antd"
import {
	checkConflictedActiveTime,
	checkConflictedReceiver,
	checkReceiptCode
} from "../../../../validators/customer/customerReceiver"
import {forceValidateFields, handleReset} from "../../../../utils/form"

const dateFormat = "YYYY-MM-DD"
const AOption = AutoComplete.Option

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = () => {
		const {form} = this.props
		forceValidateFields(form)
		this.setState({
			visible: true
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
	handleFields = (fields) => {
		const {effectTime} = fields
		fields.effectTime = `${effectTime.format(dateFormat)} 00:00:00`
		return fields
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.handleFields(values)
				onOk(values)
				this.hideModelHandler()
			}
		})
	}

	render() {
		const {getFieldDecorator} = this.props.form
		const {children, title, record, dispatch, selectEmployee} = this.props
		let {confirmLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
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
		const checkConflictedReceiverInternal = (rule, value, callback) => {
			const {customerCode} = record
			const values = {
				customerCode,
				receiver: value
			}
			checkConflictedReceiver(rule, values, callback)
			const receiverValues = {
				code: value
			}
			checkReceiptCode(rule, receiverValues, callback)
		}
		// 生效时间验证
		const checkConflictedActiveTimeInternal = (rule, value, callback) => {
			const {customerCode} = record
			const values = {
				customerCode,
				effectTime: value ? value.format(dateFormat) : undefined
			}
			checkConflictedActiveTime(rule, values, callback)
		}
		const receiptsAutoComplete = (value) => {
			dispatch({
				type: "selectEmployee/receiptsAutoComplete",
				payload: {
					q: value
				}
			})
		}
		const disabledEffectTime = (startValue) => {
			if (!startValue) {
				return false
			} else {
				const sevenDaysAgo = moment().subtract({days: 180}).startOf("day")
				if (sevenDaysAgo.isBefore(startValue)) {
					const dayOfWeek = startValue.day()
					const dateOfMonth = startValue.date()
					if (dayOfWeek === 1) {
						return false
					} else if (dateOfMonth === 1) {
						return false
					} else {
						return true
					}
				} else {
					return true
				}
			}
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
					visible={this.state.visible}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
				>
					<Form.Item
						{...formItemLayout}
						label="收款客服"
					>
						{getFieldDecorator("receiver", {
							rules: [{
								required: true,
								message: "必填"
							}, {
								validator: checkConflictedReceiverInternal
							}]
						})(
							<AutoComplete
								allowClear
								placeholder="选择收款客服"
								style={{width: "100%"}}
								onSearch={receiptsAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={selectEmployee.receipts.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>)
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="生效时间"
					>
						{getFieldDecorator("effectTime", {
							rules: [{
								required: true,
								message: "必填"
							}, {
								validator: checkConflictedActiveTimeInternal
							}]
						})(
							<DatePicker
								format={dateFormat}
								disabledDate={disabledEffectTime}
							/>)
						}
					</Form.Item>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
