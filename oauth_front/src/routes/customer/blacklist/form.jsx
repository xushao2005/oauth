import React, {Component} from "react"
import { Modal, Form, Spin, AutoComplete, Radio } from "antd"
import CountryFromItem from "./countryFromItem"
import {handleReset} from "../../../utils/form"
import * as productService from "../../../services/product"
import * as blacklistService from "../../../services/customer/customerBlacklist"

class FormModal extends Component {
	constructor(props) {
		super(props)
		const {forbiddenAllCountries} = this.props.record
		this.state = {
			visible: false,
			isAll: this.props.record.id ? forbiddenAllCountries : true
		}
	}
	showModelHandler = () => {
		this.setState({
			visible: true
		})
	}
	handleValues = (values) => {
		// let countryNameArray = []
		// const separator = /、|\n|\r/
		if (values.countries && values.countries.value) {
			// values.countryStringNames = values.countries.value
			// countryNameArray = values.countries.value.split(separator)
			values.countries = values.countries.value
		}
		return values
	}
	okHandler = () => {
		const {form, dispatch, customer} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				if (!this.props.record.id) {
					const fields = this.handleValues(values)
					dispatch({
						type: "customerBlacklist/create",
						payload: {
							customerCode: customer.currentCustomer.customerCode,
							...fields
						}
					})
					handleReset(form, {forbiddenAllCountries: "true"})
					this.setState({isAll: true})
				} else {
					const fields = this.handleValues(values)
					fields.productCode = this.props.record.productCode
					dispatch({
						type: "customerBlacklist/update",
						payload: {
							customerCode: customer.currentCustomer.customerCode,
							...fields,
							id: this.props.record.id
						}
					})
				}
				this.hideModelHandle()
			}
		})
	}
	hideModelHandle = () => {
		this.setState({
			visible: false
		})
	}
	// 产品相关
	handleSelectProduct = async (value) => {
		const {customer, form} = this.props
		const param = {productCode: value, customerCode: customer.currentCustomer.customerCode}
		const {data} = await blacklistService.verifyProductCode(param)
		if (!data) {
			form.validateFields(["productCode"], {force: true})
		}
	}
	handleSearchProduct = (value) => {
		this.props.dispatch({
			type: "selectProduct/selection",
			payload: {
				p: value
			}
		})
	}
	// 国家相关
	handleIsAllChoose = (e) => {
		const value = e.target.value
		if (value === "true") {
			this.setState({ isAll: true })
		}
		if (value === "false") {
			this.setState({ isAll: false })
		}
	}
	checkCountryNames = async (rule, value, callback) => {
		if (!value || !value.value) {
			callback("必填")
		} else {
			const separator = /、|\n|\r/
			const countryNames = value.value.split(separator)
			const newSet = new Set()
			const duplicated = []
			for (const item of countryNames) {
				if (/^\s*$/.test(item)) {
					callback("不支持的空白符号")
					return
				}
				if (newSet.has(item)) {
					duplicated.push(item)
				} else {
					newSet.add(item)
				}
			}
			if (duplicated.length > 0) {
				callback(`您重复输入了${duplicated.join("，")}`)
			} else {
				const params = {}
				for (let index = 0; index < countryNames.length; index += 1) {
					params[`countries[${index}]`] = countryNames[index]
				}
				const {data} = await productService.validCountryNames(params)
				if (data.length > 0) {
					callback(`您输入了不存在的国家：${data.join("，")}`)
				} else {
					callback()
				}
			}
		}
	}
	checkProductNames = async (rule, value, callback) => {
		const {customer} = this.props
		const reg = /^\+?[1-9][0-9]*$/
		if (this.props.record.id) { // 编辑处理
			callback()
		}
		if (reg.test(value)) { // 数字处理
			const param = {productCode: value, customerCode: customer.currentCustomer.customerCode}
			const {data} = await blacklistService.verifyProductCode(param)
			if (!data) {
				callback("黑名单中已存在该产品或该产品不存在")
			} else {
				callback()
			}
		} else if (!value) { // 无值处理
			callback("请选择产品名称")
		} else { // 文字处理
			callback("该产品非法")
		}
	}
	render() {
		const {children, dispatch} = this.props
		const {getFieldDecorator} = this.props.form
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
		let {confirmLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={this.props.title}
					visible={this.state.visible && !confirmLoading}
					width={800}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandle}
					maskClosable={false}
					confirmLoading={confirmLoading}
				>
					<Form>
						<Spin spinning={confirmLoading}>
							<Form.Item
								{...formItemLayout}
								label="产品名称"
							>
								{getFieldDecorator("productCode", {
									initialValue: this.props.record.productName,
									rules: [{
										required: true,
										message: "必填"
									}, {
										validator: this.checkProductNames
									}]
								})(
									<AutoComplete
										allowClear
										placeholder="输入产品名称"
										disabled={!!this.props.record.id}
										onSelect={this.handleSelectProduct}
										onSearch={this.handleSearchProduct}
										dataSource={this.props.selectProduct.products.map(item =>
											(<AutoComplete.Option key={item.productcode} value={item.productcode}>
												{item.productname}</AutoComplete.Option>)
										)}
									/>
								)
								}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="是否全部国家"
							>
								{getFieldDecorator("forbiddenAllCountries", {
									initialValue: this.props.record.id ? String(this.props.record.forbiddenAllCountries) : "true",
									rules: [{
										required: true,
										message: "必填"
									}]
								})(
									<Radio.Group onChange={this.handleIsAllChoose}>
										<Radio value="true">是</Radio>
										<Radio value="false">否</Radio>
									</Radio.Group>
								)
								}
							</Form.Item>
							{!this.state.isAll && <Form.Item
								{...formItemLayout}
								label="国家"
							>
								{getFieldDecorator("countries", {
									initialValue: {value: this.props.record.countries},
									rules: [{
										required: true,
										message: "必填"
									}, {
										validator: this.checkCountryNames
									}]
								})(
									<CountryFromItem dispatch={dispatch}/>
								)
								}
							</Form.Item>}
						</Spin>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
