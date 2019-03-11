import React, {Component} from "react"
import {Form, Modal, Spin, Select, DatePicker, Checkbox } from "antd"
import moment from "moment/moment"
import {checkConflictedAffiliated, checkConflictedActiveTime} from "../../../../validators/customer/customerAffiliated"
import {handleReset} from "../../../../utils/form"
import {filter as companyFilter} from "../../../../utils/biz/company"

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
		const {dispatch} = this.props
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
		dispatch({
			type: "selectCompany/selection"
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
		const {children, title, record, selectCompany} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		// // 检测所属公司
		const checkAffiliatedCompany = (rule, value, callback) => {
			const {customerCode} = record
			// 是否更改结算公司
			const updateSettleCompany = true
			const values = {
				customerCode,
				updateSettleCompany,
				affiliatedCompany: value
			}
			checkConflictedAffiliated(rule, values, callback)
		}
		// 检测生效时间
		const checkAffiliatedActiveTime = (rule, value, callback) => {
			const {customerCode} = record
			// 是否更改结算公司
			const updateSettleCompany = true
			const values = {
				customerCode,
				updateSettleCompany,
				effectTime: value ? value.format(dateFormat) : undefined
			}
			checkConflictedActiveTime(rule, values, callback)
		}
		const today = moment().startOf("day")
		const disabledEffectTime = current => current && !current.isAfter(today)
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
					maskClosable={false}
				>
					<Form>
						<Spin spinning={viewLoading}>
							{!viewLoading && <div>
								<Form.Item
									{...formItemLayout}
									label="所属公司"
								>
									{getFieldDecorator("affiliatedCompany", {
										rules: [{
											required: true,
											message: "必填"
										}, {
											validator: checkAffiliatedCompany
										}]
									})(
										<Select
											style={{width: "100%"}}
											placeholder="选择所属公司"
											showSearch
											filterOption={companyFilter}
											allowClear
										>
											{selectCompany.companies.map(item =>
												(<Option key={item.id}>{item.name}</Option>)
											)}
										</Select>
									)}
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
											validator: checkAffiliatedActiveTime
										}]
									})(
										<DatePicker
											format={dateFormat}
											disabledDate={disabledEffectTime}
										/>)
									}
								</Form.Item>
							</div>}
						</Spin>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
