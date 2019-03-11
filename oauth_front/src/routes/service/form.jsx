import React, {Component} from "react"
import {Modal, Form, Spin, AutoComplete, Input, Radio, Select, Icon} from "antd"
import {styles} from "../../components/layouts"
import {checkCode, checkName, checkSuppliercode} from "../../validators/service"
import {handleReset} from "../../utils/form"
import PLATFORM_CONSTANTS from "../../constants/platform"
import style from "./form.less"

const AOption = AutoComplete.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const {TextArea} = Input
const Option = Select.Option

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			isShowPlatformType: false,
			serviceUnitId: "",
			isEditable: false
		}
	}
	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		// 编辑，保存当前service
		if (payload) {
			dispatch({
				type: "service/view",
				payload: {
					id: payload.id
				}
			})
			dispatch({
				type: "service/saveNextCode",
				payload: payload.code
			})
			this.setState({
				isEditable: true,
				serviceUnitId: payload.serviceUnitId
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
		if (this.props.record.code === undefined) {
			handleReset(this.props.form, {statusId: 0})
		}
		this.setState({
			visible: false
		})
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			const {record} = this.props
			if (record.supplierName === values.suppliercode) {
				values.suppliercode = record.suppliercode
			}
			if (!err) {
				onOk(values)
				this.hideModelHandler()
			}
		})
	}
	supplierAutoComplete = (value) => {
		const {dispatch} = this.props
		dispatch({
			type: "selectSupplier/selection",
			payload: {
				q: value
			}
		})
	}
	handleServiceUnitIdChanged = (value) => {
		const {dispatch} = this.props
		const {setFieldsValue} = this.props.form
		if (value === "23") {
			this.setState({
				isShowPlatformType: true
			})
		} else {
			this.setState({
				isShowPlatformType: false
			})
		}
		this.setState({
			serviceUnitId: value
		})
		dispatch({
			type: "service/nextCode",
			payload: {
				serviceUnitId: value
			}
		}).then(() => {
			setFieldsValue({code: this.props.service.nextCode})
		})
	}
	render() {
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
				maxWidth: 700,
				margin: "16px auto"
			}
		}
		const {getFieldDecorator, getFieldValue} = this.props.form
		const {children, title, record, selectSupplier, selectUnits, transportMode,
			serviceCalcType} = this.props
		const {nextCode, currentService} = this.props.service
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		const autoCompleteSupplierAccount = (value) => {
			const {dispatch} = this.props
			if (typeof (getFieldValue("suppliercode")) !== "undefined"
				&& getFieldValue("suppliercode") !== "") {
				dispatch({
					type: "selectSupplier/autoCompleteSupplierAccount",
					payload: {
						q: typeof (value) === "undefined" ? "" : value,
						supplierCode: getFieldValue("suppliercode")
					}
				})
			}
		}
		const payAccounts = selectSupplier.suppliersPayAccount.map(item => (
			<Option key={item.payAccountId} value={`${item.payAccountId}`}>{`${item.payAccountName}/${item.payCurrency}`}</Option>)
		)
		// 检测 编码
		const checkCodeInternal = (rule, value, callback) => {
			const values = {
				code: value,
				serviceUnitId: this.state.serviceUnitId
			}
			checkCode(rule, values, callback)
		}
		// 检测 名字
		const checkNameInternal = (rule, value, callback) => {
			const values = {
				code: record.code,
				name: value
			}
			checkName(rule, values, callback)
		}
		// 检测 供应商名称
		const checkSuppliercodeInternal = (rule, value, callback) => {
			if (value === record.supplierName) {
				callback()
			}
			const values = {
				code: value
			}
			checkSuppliercode(rule, values, callback)
		}
		// 平台信息
		const onCustomerPlamChange = () => {
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					okText="保存"
					width={800}
					confirmLoading={confirmLoading}
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					visible={this.state.visible && !confirmLoading}
				>
					<Form className={styles.modalForm}>
						<Spin spinning={viewLoading}>
							{!viewLoading && <div>
								<div className={style.info}>
									<Icon type="info-circle" style={{marginRight: "5px"}}/>
									新增的服务，在一天之内允许纠正该服务的供应商！
								</div>
								<Form.Item
									{...formItemLayout}
									label="供应商名称"
								>
									{!this.state.isEditable || currentService.editable ?
										getFieldDecorator("suppliercode", {
											initialValue: record.supplierName,
											rules: [{
												required: true,
												message: "必填"
											}, {
												validator: checkSuppliercodeInternal
											}]
										})(
											<AutoComplete
												allowClear
												placeholder="选择供应商"
												onSearch={this.supplierAutoComplete}
												dropdownMatchSelectWidth={false}
												dropdownStyle={{minWidth: 150}}
												dataSource={selectSupplier.suppliers.map(item =>
													(<AOption key={item.code} value={item.code}>{item.nameCh}</AOption>)
												)}
											/>
										)
										:
										getFieldDecorator("suppliercode", {
											initialValue: String(record.suppliercode)
										})(<Select
											allowClear
											disabled
										>
											<Option key={record.suppliercode} value={String(record.suppliercode)}>
												{record.supplierName}
											</Option>
										</Select>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="付款账户"
								>
									{
										getFieldDecorator("payAccountId", {
											initialValue: typeof (record.payAccountName) === "undefined" ? "" : `${record.payAccountName}/${record.payCurrency}`,
											rules: [{
												required: false,
												message: "必填"
											}]
										})(
											<AutoComplete
												allowClear
												autoFocus
												dataSource={payAccounts}
												placeholder="请选择付款账号/币种"
												onFocus={autoCompleteSupplierAccount}
												onSearch={autoCompleteSupplierAccount}
											/>
										)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="最小服务单元"
								>
									{!this.state.isEditable ?
										getFieldDecorator("serviceUnitId", {
											rules: [{
												required: true,
												message: "必填"
											}]
										})(
											<Select
												style={{width: "100%"}}
												placeholder="选择最小服务单元"
												allowClear
												onChange={this.handleServiceUnitIdChanged}
											>
												{selectUnits.units.map(item =>
													<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
												}
											</Select>
										)
										:
										getFieldDecorator("serviceUnitId", {
											initialValue: String(record.serviceUnitId)
										})(<Select
											allowClear
											disabled
										>
											{selectUnits.units.map(item =>
												<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
											}
										</Select>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="服务编码"
								>
									{!this.state.isEditable ?
										getFieldDecorator("code", {
											initialValue: nextCode,
											rules: [{
												required: true,
												message: "必填"
											}, {
												pattern: new RegExp(`^2${this.state.serviceUnitId}\\d{4}$`),
												message: "应付服务编码只能是2+最小服务单元编码+4位数字"
											}, {
												validator: checkCodeInternal
											}]
										})(
											<Input/>
										)
										:
										getFieldDecorator("code", {
											initialValue: nextCode
										})(<Input disabled/>)
									}
									{/* {getFieldDecorator("code", {
										initialValue: nextCode,
										rules: [{
											required: true,
											message: "必填"
										}, {
											pattern: new RegExp(`^2${this.state.serviceUnitId}\\d{4}$`),
											message: "应付服务编码只能是2+最小服务单元编码+4位数字"
										}, {
											validator: !this.state.isEditable ? checkCodeInternal : ""
										}]
									})(
											!this.state.isEditable
												? <Input/>
												: <span>{nextCode}</span>
										)
									} */}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="服务名称"
								>
									{getFieldDecorator("name", {
										initialValue: record.name,
										rules: [{
											required: true,
											message: "必填"
										}, {
											max: 30,
											message: "服务名称字数小于或等于30个"
										}, {
											validator: checkNameInternal
										}]
									})(
										<Input/>
									)
									}
								</Form.Item>
								{(this.state.isShowPlatformType || record.serviceUnitId === 23) && <Form.Item
									{...formItemLayout}
									label="销售平台类型"
								>
									{getFieldDecorator("platformType", {
										initialValue: record.platformType === undefined ? 1 : record.platformType,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
											onChange={onCustomerPlamChange}
										>
											{Array.from(PLATFORM_CONSTANTS).map(([key, value]) =>
												<RadioButton key={key} value={key}>{value}</RadioButton>
											)}
										</RadioGroup>)
									}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="运输方式"
								>
									{getFieldDecorator("transportId", {
										initialValue: String(record.transportId || ""),
									})(
										<Select
											style={{width: "100%"}}
											placeholder="选择运输方式"
											allowClear
										>
											{transportMode.list.map(item => (item.ikey
												? <Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>
												: <Option key="10000" value="10000"/>
											)
											)
											}
										</Select>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="服务计费维度"
								>
									{getFieldDecorator("calcType", {
										initialValue: String(record.calcType || ""),
									})(
										<Select
											style={{width: "100%"}}
											placeholder="选择服务计费维度"
											allowClear
										>
											{serviceCalcType.list.map(item => (item.code
												? <Option key={item.code} value={String(item.code)}>{item.desc}</Option>
												: <Option key="10000" value="10000"/>
											)
											)
											}
										</Select>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否启用"
								>
									{getFieldDecorator("statusId", {
										initialValue: (record.statusId ? 1 : 0),
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup>
											<Radio value={1}>是</Radio>
											<Radio value={0}>否</Radio>
										</RadioGroup>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="服务描述"
								>
									{getFieldDecorator("mark", {
										initialValue: record.mark,
									}, {
										max: 2000,
										message: "服务描述字数需小于或等于2000个"
									})(
										<TextArea placeholder="填写服务描述" autosize={{ minRows: 2, maxRows: 6 }}/>
									)
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
