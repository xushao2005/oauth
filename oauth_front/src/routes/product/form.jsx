import React, {Component} from "react"
import {AutoComplete, Form, Icon, Input, Modal, Popover, Radio, Select, Spin} from "antd"
import classnames from "classnames"
import {styles} from "../../components/layouts"
import {patterns, handleReset} from "../../utils/form"
import * as productService from "../../services/product"
import {checkUniqueCode, checkUniqueName} from "../../validators/product"
import CountryFormItem from "./countryFormItem"
import formStyle from "./form.less"
import {checkValidEmployee} from "../../validators/employee"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const AOption = AutoComplete.Option
const Option = Select.Option
const {TextArea} = Input

class FormModal extends Component {
	constructor(props) {
		super(props)
		const {record} = this.props
		this.state = {
			visible: false,
			cpVisible: record.cpFlag,
			lineOff: record.lineOff,
			calcGweightVisible: record.calcGweight,
			omnidistanceVisible: record.omnidistance,
			level2CatalogsList: [],
			rowBase: formStyle.shrinkSize
		}
	}
	showModelHandler = (e) => {
		const {dispatch, payload, record} = this.props
		this.props.form.resetFields()
		if (!payload) {
			dispatch({
				type: "product/nextCode"
			})
		}
		if (payload) {
			if (record.level1Catalog === 1) {
				this.setState({
					level2CatalogsList: this.props.normalCatalogs
				})
			} else if (record.level1Catalog === 2) {
				this.setState({
					level2CatalogsList: this.props.limitedCatalogs
				})
			}
		}
		dispatch({
			type: "selectCompany/selection"
		})
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
	}
	handleCpFlag = (e) => {
		if (e.target.value === "true") {
			this.setState({
				cpVisible: true
			})
		} else {
			this.setState({
				cpVisible: false
			})
		}
	}
	handleLineOff = (e) => {
		this.setState({
			lineOff: e.target.value
		})
	}
	handlecCalcGweight = (e) => {
		if (e.target.value === "true") {
			this.setState({
				calcGweightVisible: true
			})
		} else {
			this.setState({
				calcGweightVisible: false
			})
		}
	}
	handleOmnidistance = (e) => {
		if (e.target.value === "true") {
			this.setState({
				omnidistanceVisible: true
			})
		} else {
			this.setState({
				omnidistanceVisible: false
			})
		}
	}
	hideModelHandler = () => {
		const productcode = this.props.form.getFieldValue("productcode")
		if (this.props.record.productcode === undefined) {
			handleReset(this.props.form, {productcode: productcode})
		}
		this.setState({
			visible: false
		})
	}
	handleFields = (fields) => {
		const {countryNames, warehousNames} = fields
		const separator = /、|\n|\r/
		if (countryNames && countryNames.value) {
			fields.countryNames = countryNames.value.split(separator)
		} else {
			fields.countryNames = undefined
		}
		if (warehousNames) {
			fields.warehousNames = warehousNames.split(separator)
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
	checkCountryNames = async (rule, value, callback) => {
		if (!value || !value.value) {
			callback()
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
	checkWarehousNames = (rule, value, callback) => {
		if (!value) {
			callback()
		} else {
			const separator = /、|\n|\r/
			const warehousNames = value.split(separator)
			const newSet = new Set()
			const duplicated = []
			for (const item of warehousNames) {
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
				const {companies} = this.props
				const notExisted = warehousNames.filter(item =>
					!companies.find(company => company.name === item))
				if (notExisted.length > 0) {
					callback(`您输入了不存在的揽收仓：${notExisted.join("，")}`)
				} else {
					callback()
				}
			}
		}
	}

	// 货品一级属性处理
	handleChangeLevel1tag = (e) => {
		const {form} = this.props
		if (e.target.value === 2) {
			// 特货处理
			this.setState({
				level2CatalogsList: this.props.limitedCatalogs
			})
		} else {
			// 普货处理
			this.setState({
				level2CatalogsList: this.props.normalCatalogs
			})
		}
		form.setFieldsValue({level2Catalogs: []})
	}

	extendRowSize = () => {
		this.setState({
			rowBase: formStyle.extendSize
		})
	}
	shrinkRowSize = () => {
		this.setState({
			rowBase: formStyle.shrinkSize
		})
	}
	employeesAutoComplete = (value) => {
		this.props.dispatch({
			type: "selectEmployee/employeesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	checkValidEmployeeInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkValidEmployee(rule, values, callback)
	}
	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 4}
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
		const {getFieldDecorator} = this.props.form
		const {
			dispatch, children, title, record, payload, productCode,
			platformType, productTypes, electricTypes, chinaPostTypes, productGroups,
			saleProductTypes, innerProductTypes, selectEmployee
		} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		const checkUniqueCodeInternal = (rule, value, callback) => {
			if (record && !record.productcode) {
				checkUniqueCode(rule, {productcode: value}, callback)
			} else {
				callback()
			}
		}
		const checkUniqueNameInternal = (rule, value, callback) => {
			const productcode = payload ? payload.productcode : null
			checkUniqueName(rule, {
				productcode,
				productname: value
			}, callback)
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible && <Modal
					title={title}
					style={{top: 0}}
					width="100%"
					height="100%"
					confirmLoading={confirmLoading}
					visible={this.state.visible && !confirmLoading}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm)}
				>
					<Form className={styles.modalForm}>
						<Spin spinning={viewLoading}>
							{!viewLoading && this.state.visible &&
							<div>
								{<Form.Item
									{...formItemLayout}
									label="产品编码"
								>
									{getFieldDecorator("productcode", {
										initialValue: productCode,
										rules: [{
											required: true,
											message: "必填"
										}, {
											type: "string",
											pattern: patterns.digit,
											message: "必须为数字"
										}, {
											validator: checkUniqueCodeInternal
										}]
									})(
										<Input disabled={record && !!record.productcode}/>)
									}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="产品名称"
								>
									{getFieldDecorator("productname", {
										initialValue: record.productname,
										rules: [{
											required: true,
											message: "必填"
										}, {
											type: "string",
											pattern: patterns.character,
											message: "必须为字符"
										}, {
											validator: checkUniqueNameInternal
										}]
									})(
										<Input/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品来源"
								>
									{getFieldDecorator("lineOff", {
										initialValue: record.lineOff || "1",
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup onChange={this.handleLineOff}>
											<RadioButton value="0">平台</RadioButton>
											<RadioButton value="1">非平台</RadioButton>
										</RadioGroup>)
									}
								</Form.Item>
								{this.state.lineOff === "0" && <Form.Item
									{...formItemLayout}
									label="平台类型"
								>
									{getFieldDecorator("platformType", {
										initialValue: String(record.platformType || "")
									})(
										<Select
											allowClear>
											{platformType.list.map(item =>
												<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
											}
										</Select>)
									}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="产品类型"
								>
									{getFieldDecorator("productType", {
										initialValue: record.productType,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select
											allowClear>
											{productTypes.map(item =>
												<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
											}
										</Select>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品组"
								>
									{getFieldDecorator("productGroup", {
										initialValue: String(record.productGroup || ""),
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select
											allowClear>
											{productGroups.map(item =>
												<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
											}
										</Select>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="销售产品类型"
								>
									{getFieldDecorator("saleProductType", {
										initialValue: String(record.saleProductType || ""),
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select allowClear>
											{saleProductTypes.map(item =>
												<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
											}
										</Select>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="内部产品类型"
								>
									{getFieldDecorator("innerProductType", {
										initialValue: String(record.innerProductType || ""),
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select allowClear>
											{innerProductTypes.map(item =>
												<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
											}
										</Select>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="负责人"
								>
									{getFieldDecorator("director", {
										initialValue: record.director,
										rules: [{
											validator: this.checkValidEmployeeInternal
										}]
									})(
										<AutoComplete
											allowClear
											placeholder="选择负责人"
											onSearch={this.employeesAutoComplete}
											dropdownMatchSelectWidth={false}
											dropdownStyle={{minWidth: 150}}
											dataSource={selectEmployee.employees.length > 0
												? selectEmployee.employees.map(item =>
													(<AOption key={item.id}>{item.name}</AOption>))
												: (record.director && [(<AOption key={record.director}>
													{record.directorName}</AOption>)])
											}
										/>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="自有产品推荐级别"
								>
									{getFieldDecorator("recommendLevel", {
										initialValue: String(record.recommendLevel || "") || "0",
										rules: [{
											required: true,
											message: "必填"
										}, {
											type: "string",
											pattern: "^\\d{1}$",
											message: "必须为0~9的整数"
										}]
									})(
										<RadioGroup>
											<RadioButton value="0">自有产品</RadioButton>
											<RadioButton value="1">非自有产品</RadioButton>
										</RadioGroup>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="带电类型"
								>
									{getFieldDecorator("electricType", {
										initialValue: record.electricType,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select
											allowClear>
											{electricTypes.map(item =>
												<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
											}
										</Select>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否中邮产品"
								>
									{getFieldDecorator("cpFlag", {
										initialValue: record.cpFlag !== undefined && `${record.cpFlag}`,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
											onChange={this.handleCpFlag}
										>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								{this.state.cpVisible && <Form.Item
									{...formItemLayout}
									label="中邮类型"
								>
									{getFieldDecorator("cpType", {
										initialValue: record.cpType,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select
											allowClear>
											{chinaPostTypes.map(item =>
												<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
											}
										</Select>)
									}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="是否全程"
								>
									{getFieldDecorator("omnidistance", {
										initialValue: record.omnidistance !== undefined && `${record.omnidistance}`,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
											onChange={this.handleOmnidistance}
										>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								{this.state.omnidistanceVisible && this.state.cpVisible && <Form.Item
									{...formItemLayout}
									label="是否中邮全程"
								>
									{getFieldDecorator("chinaPost", {
										initialValue: `${record.chinaPost}`,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
										>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="是否可追踪"
								>
									{getFieldDecorator("track", {
										initialValue: record.track !== undefined && `${record.track}`,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
										>
											<Radio value="true">全程追踪</Radio>
											<Radio value="false">半程追踪</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否计泡"
								>
									{getFieldDecorator("calcGweight", {
										initialValue: record.calcGweight !== undefined && `${record.calcGweight}`
									})(
										<RadioGroup
											onChange={this.handlecCalcGweight}
										>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								{this.state.calcGweightVisible && <Form.Item
									{...formItemLayout}
									label="产品计泡系数"
								>
									{getFieldDecorator("calcGweightRate", {
										initialValue: String(record.calcGweightRate || ""),
										rules: [{
											required: true,
											message: "必填"
										}, {
											type: "string",
											pattern: "^[^0]\\d{0,4}$|^100000$",
											message: "必须为1~100000的整数"
										}]
									})(
										<Input/>
									)}
								</Form.Item>
								}
								<Form.Item
									{...formItemLayout}
									label="是否走空运"
								>
									{getFieldDecorator("byAir", {
										initialValue: record.byAir !== undefined && `${record.byAir}`
									})(
										<RadioGroup>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="时效等级"
								>
									{getFieldDecorator("effectiveness", {
										initialValue: record.effectiveness && `${record.effectiveness}`
									})(
										<RadioGroup>
											<Radio value="1">快</Radio>
											<Radio value="2">中</Radio>
											<Radio value="3">慢</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否合并报价"
								>
									{getFieldDecorator("quoteType", {
										initialValue: record.quoteType
									})(
										<RadioGroup>
											<Radio value="C">合并</Radio>
											<Radio value="E">各自报价</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="货品一级属性"
								>
									{getFieldDecorator("level1Catalog", {
										initialValue: record.level1Catalog,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup onChange={this.handleChangeLevel1tag}>
											<RadioButton value={1}>普货</RadioButton>
											<RadioButton value={2}>特货</RadioButton>
										</RadioGroup>
									)}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="货品二级属性"
								>
									{getFieldDecorator("level2Catalogs", {
										initialValue: record.level2CatalogCodes,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select mode="multiple">
											{this.state.level2CatalogsList.map(item =>
												<Option key={item.ikey}>{item.value}</Option>
											)}
										</Select>
									)}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否启用"
								>
									{getFieldDecorator("enable", {
										initialValue: record.enable !== undefined && `${record.enable}`,
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<RadioGroup
										>
											<Radio value="true">是</Radio>
											<Radio value="false">否</Radio>
										</RadioGroup>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品说明"
								>
									{getFieldDecorator("desc", {
										initialValue: record.desc
									})(
										<TextArea
											className={classnames(this.state.rowBase, formStyle.transition)}
											onFocus={this.extendRowSize}
											onBlur={this.shrinkRowSize}/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label={<span>通达国家&nbsp;<Popover content="国家名称与国家名称之间请以顿号或换行符隔开">
										<Icon type="question-circle-o"/>
									</Popover></span>}
								>
									{getFieldDecorator("countryNames", {
										initialValue: {value: record.countryNames && record.countryNames.join("、")},
										rules: [{
											validator: this.checkCountryNames
										}]
									})(
										<CountryFormItem dispatch={dispatch}/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label={<span>揽收仓&nbsp;<Popover content="揽收仓名称与揽收仓名称之间请以顿号或换行符隔开">
										<Icon type="question-circle-o"/>
									</Popover></span>}
								>
									{getFieldDecorator("warehousNames", {
										initialValue: record.warehousNames && record.warehousNames.join("、"),
										rules: [{
											validator: this.checkWarehousNames
										}]
									})(
										<TextArea rows={4}/>)
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
