import React, {Component} from "react"
import {Form, Input, Modal, DatePicker, Select} from "antd"
import moment from "moment"
import {patterns, handleReset} from "../../utils/form"
import {checkConflictedActiveTime} from "../../validators/exchangeRate"

const Option = Select.Option
const dateFormat = "YYYY-MM-DD"
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
	handleValues = (values) => {
		const {beginTime, endTime} = values
		if (beginTime) {
			values.beginTime = `${beginTime.format(dateFormat)} 00:00:00`
		}
		if (endTime) {
			values.endTime = `${endTime.format(dateFormat)} 00:00:00`
		}
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.handleValues(values)
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
		// 表单验证函数
		const {getFieldDecorator, getFieldsValue} = this.props.form
		const {children, title, record, editable, selectCurrency} = this.props
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 7}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 10}
			}
		}
		// loading 设置
		let {confirmLoading, resourcesLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (resourcesLoading === undefined) {
			resourcesLoading = false
		}
		// 生效时间冲突校验
		const checkConflictedActiveTimeInternal = (rule, value, callback) => {
			const fields = getFieldsValue()
			const {orgCurrencyId, targetCurrencyId, beginTime} = fields
			let newDate
			if (beginTime) {
				newDate = `${beginTime.format(dateFormat)} 00:00:00`
			}
			const values = {
				originalCurrencyId: orgCurrencyId,
				targetCurrencyId,
				newDate
			}
			checkConflictedActiveTime(rule, values, callback)
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					width={400}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					visible={this.state.visible}
					confirmLoading={confirmLoading}
				>
					<Form>
						<Form.Item
							{...formItemLayout}
							label="源币种"
						>
							{editable ?
								getFieldDecorator("orgCurrencyId", {
									initialValue: record.orgCurrencyId,
									rules: [{
										required: true,
										message: "请选择源币种"
									}]
								})(<Select
									style={{width: 150}}
									allowClear
								>
									{selectCurrency.currencies.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
								</Select>)
								:
								getFieldDecorator("orgCurrencyId", {
									initialValue: record.orgCurrencyId
								})(<Select
									style={{width: 150}}
									allowClear
									disabled
								>
									{selectCurrency.currencies.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
								</Select>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="目标币种"
						>
							{editable ?
								getFieldDecorator("targetCurrencyId", {
									initialValue: record.targetCurrencyId,
									rules: [{
										required: true,
										message: "请选择目标币种"
									}]
								})(<Select
									style={{width: 150}}
									allowClear
								>
									{selectCurrency.currencies.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
								</Select>)
								:
								getFieldDecorator("targetCurrencyId", {
									initialValue: record.targetCurrencyId
								})(<Select
									style={{width: 150}}
									allowClear
									disabled
								>
									{selectCurrency.currencies.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
								</Select>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="汇率"
						>
							{
								getFieldDecorator("rate", {
									initialValue: String(record.rate || ""),
									rules: [{
										required: true,
										message: "请填写汇率"
									}, {
										type: "string",
										pattern: patterns.decimal,
										message: "汇率必须为合法数字"
									}]
								})(<Input/>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="开始时间"
						>
							{editable ?
								getFieldDecorator("beginTime", {
									initialValue: record.beginTime === undefined ? null : moment(record.beginTime),
									rules: [{
										required: true,
										message: "请选择开始时间"
									}, {
										validator: checkConflictedActiveTimeInternal
									}]
								})(<DatePicker/>)
								:
								getFieldDecorator("beginTime", {
									initialValue: record.beginTime === undefined ? null : moment(record.beginTime)
								})(<DatePicker disabled/>)
							}
						</Form.Item>
						{!editable && <Form.Item
							{...formItemLayout}
							label="结束时间"
						>
							{
								getFieldDecorator("endTime", {
									initialValue: record.endTime === undefined ? null : moment(record.endTime)
								})(<DatePicker disabled/>)
							}
						</Form.Item>}
						<Form.Item
							{...formItemLayout}
							label="备注"
						>
							{
								getFieldDecorator("mark", {
									initialValue: record.mark
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
