import React, {Component} from "react"
import {Form, Modal, Radio, Input} from "antd"
import CountryFormItem from "./countryFormItem"
import * as productService from "../../services/product"

const RadioGroup = Radio.Group
const {TextArea} = Input

class WhiteBlackRuleForm extends Component {
	constructor(props) {
		super(props)
		const {r} = this.props
		this.state = {
			visible: false,
			isAllCountries: r.allCountries, //是否全部国家
		}
	}
	showModelHandler = () => {
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		const {r} = this.props
		const {getFieldsValue, setFieldsValue} = this.props.form
		const fields = getFieldsValue()
		this.setState({
			visible: false
		})
		if (!r.id) {
			this.setState({
				isAllCountries: true
			})
			if (fields.name) {
				setFieldsValue({name: undefined})
			}
			if (fields.mode) {
				setFieldsValue({mode: undefined})
			}
			if (fields.whiteBlackListCustomers) {
				setFieldsValue({whiteBlackListCustomers: undefined})
			}
			if (fields.countriesNames) {
				setFieldsValue({countriesNames: undefined})
			}
			if (fields.allCountries) {
				setFieldsValue({
					allCountries: "true"
				})
			}
		}
	}
	handleFields = (fields) => {
		const {r} = this.props
		if (r && r.id) {
			fields.id = r.id
		}
		const {countriesNames} = fields
		if (countriesNames && countriesNames.value) {
			fields.countriesNames = fields.countriesNames.value
		}
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
	handleIsAllCountries = (e) => {
		const value = e.target.value
		if (value === "true") {
			this.setState({ isAllCountries: true })
		}
		if (value === "false") {
			this.setState({ isAllCountries: false })
		}
	}
	checkCustomerNames = async (rule, value, callback) => {
		if (!value) {
			callback()
		} else {
			const separator = /\n/
			const customerCodes = value.split(separator)
			const newSet = new Set()
			const duplicated = []
			for (const item of customerCodes) {
				if (/\s/.exec(item) !== null) {
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
				callback(`您重复输入了${duplicated.join("、")}`)
			} else {
				const params = {}
				for (let index = 0; index < customerCodes.length; index += 1) {
					params[`codes[${index}]`] = customerCodes[index]
				}
				const {data} = await productService.validCustomerNames(params)
				if (data.length && data[0] === "") {
					callback("不支持空行")
				} else if (data.length > 0) {
					callback(`您输入了不存在的客户：${data.join("，")}`)
				} else {
					callback()
				}
			}
		}
	}
	checkCountryNames = async (rule, value, callback) => {
		if (!value || !value.value) {
			callback("请输入对应国家名单！")
		} else {
			const separator = /、/
			const countryNames = value.value.split(separator)
			const newSet = new Set()
			const duplicated = []
			for (const item of countryNames) {
				if (/\n/.exec(item) !== null) {
					callback("请使用 、 进行分割")
					return
				}
				if (/\s/.test(item)) {
					callback("不支持的空白符号")
					return
				}
				if (!item) {
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
	render() {
		const {children, title, r, dispatch} = this.props
		const {getFieldDecorator} = this.props.form
		const modalPorps = {
			maskClosable: false,
			title: title,
			visible: this.state.visible,
			onCancel: this.hideModelHandler,
			onOk: this.okHandler
		}
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
				// maxWidth: 600,
				margin: "16px 20px"
			}
		}
		const getCustomers = (c) => {
			if (c) {
				if (c.indexOf("、") > 0) {
					return c.replace(/、/g, "\n")
				} else {
					return c
				}
			}
			return undefined
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal {...modalPorps}>
					<Form>
						<Form.Item
							{...formItemLayout}
							label="规则名"
						>
							{getFieldDecorator("name", {
								initialValue: r.name,
								rules: [{
									required: true,
									message: "必填"
								}]
							})(
								<Input placeholder="填写规则名"/>
							)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="规则类型"
						>
							{getFieldDecorator("mode", {
								initialValue: r.mode,
								rules: [{
									required: true,
									message: "必填"
								}]
							})(
								<RadioGroup>
									<Radio value="white">白名单</Radio>
									<Radio value="black">黑名单</Radio>
								</RadioGroup>
							)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="客户号名单"
						>
							{getFieldDecorator("whiteBlackListCustomers", {
								initialValue: getCustomers(r.whiteBlackListCustomers),
								rules: [{
									required: true,
									message: "请输入客户编号"
								}, {
									validator: this.checkCustomerNames
								}]
							})(
								<TextArea
									placeholder="请输入客户编号，用 回车符 分割"
									autosize={{ minRows: 4}}
								/>
							)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="是否全部国家"
						>
							{getFieldDecorator("allCountries", {
								initialValue: String(r.allCountries),
								rules: [{
									required: true,
									message: "必填"
								}]
							})(
								<RadioGroup onChange={this.handleIsAllCountries}>
									<Radio value="true">是</Radio>
									<Radio value="false">否</Radio>
								</RadioGroup>
							)
							}
						</Form.Item>
						{!this.state.isAllCountries && <Form.Item
							{...formItemLayout}
							label="国家名单"
						>
							{getFieldDecorator("countriesNames", {
								initialValue: {value: this.props.r.countriesNames},
								rules: [{
									required: true,
									message: "必填"
								}, {
									validator: this.checkCountryNames
								}]
							})(
								<CountryFormItem dispatch={dispatch}/>
							)
							}
						</Form.Item>}
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(WhiteBlackRuleForm)

