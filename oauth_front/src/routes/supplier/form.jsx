import React, {Component} from "react"
import lodash from "lodash"
import {
	AutoComplete,
	Button,
	Cascader,
	Col,
	DatePicker,
	Form,
	Icon,
	Input,
	Modal,
	notification,
	Radio,
	Select,
	Spin,
	Tabs,
	Upload
} from "antd"
import classnames from "classnames"
import {styles} from "../../components/layouts"
import {handleReset, patterns} from "../../utils/form"
import viewStyles from "./view.less"
import PictureView from "../../components/data/pictureView"
import {fileApi} from "../../constants/api"
import {
	checkUniqueBusinessLicence,
	checkUniqueCode,
	checkUniqueNameCh
} from "../../validators/supplier/supplier"
import {checkValidEmployee} from "../../validators/employee"
import OPERATION_PHASE from "../../constants/operationPhase"

const AOption = AutoComplete.Option
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const TextArea = Input.TextArea
const Option = Select.Option

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			ywLeaderOptions: [],
			compareLeaderOptions: [],
			operationPhase: "1",
			broaderType: "1"
		}
	}

	onCheck = () => {
		const form = this.props.form
		const {getFieldsValue, setFieldsValue} = form
		const fields = getFieldsValue()
		setFieldsValue(fields)
	}
	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		dispatch({
			type: "supplier/nextCode"
		})
		dispatch({
			type: "selectCompany/selection"
		})
		dispatch({
			type: "selectCurrency/selection"
		})
		dispatch({
			type: "selectRegion/selection",
			payload: {
				p: "1"
			}
		})
		dispatch({
			type: "selectRegion/searchReginons",
			regions: []
		})
		if (payload) {
			dispatch({
				type: "supplier/view",
				payload: payload
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
		if (this.props.record.supplierCode === undefined) {
			const supplierCode = this.props.supplierCode
			handleReset(this.props.form, {code: supplierCode})
		}
		this.setState({
			visible: false
		})
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const companyIds = values.companyIds
				const divisions = values.divisions
				values.companies = companyIds && companyIds.map(id => (
					{companyDepartmentCode: id}
				))
				if (divisions) {
					if (divisions.length === 2) {
						values.provinceId = divisions[0]
						values.cityId = divisions[1]
					} else if (divisions.length === 1) {
						values.cityId = divisions[0]
					}
				}
				const submitValues = lodash.omit(values, ["companyIds", "divisions"])
				onOk(submitValues)
				this.hideModelHandler()
			}
		})
	}

	render() {
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
		const {getFieldDecorator, getFieldsValue, setFieldsValue, validateFields} = this.props.form
		const {children, title, record, dispatch, supplierCode} = this.props
		const {selectOptions} = this.props
		const fileds = getFieldsValue()
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		let showBusinessLicenceAttach
		if (fileds.businessLicenceAttach) {
			showBusinessLicenceAttach = fileds.businessLicenceAttach
		}
		let showCorporateCardAttach
		if (fileds.corporateCardAttach) {
			showCorporateCardAttach = fileds.corporateCardAttach
		}
		let isTrialPhase = true
		if (fileds.operationPhase) {
			isTrialPhase = this.state.operationPhase === "1"
		}
		let isInBorder = true
		if (fileds.borderType) {
			isInBorder = this.state.broaderType === "1"
		}
		const handleBorderChange = (e) => {
			this.setState(
				{broaderType: e.target.value},
				() => {
					validateFields(["divisions"], {force: true})
				})
		}
		const handleTrialChange = (e) => {
			this.setState(
				{operationPhase: e.target.value},
				() => {
					validateFields(["companyName", "address",
						"compareLeader", "companyIds",
						"paymentTerm", "payCycle", "currencyId"], {force: true})
				})
		}
		const checkUniqueCodeInter = (rule, value, callback) => {
			const values = {
				code: value
			}
			checkUniqueCode(rule, values, callback)
				.then((_) => {
				})
		}
		const checkUniqueNameChInter = (rule, value, callback) => {
			const values = {
				code: null,
				nameCh: value
			}
			checkUniqueNameCh(rule, values, callback)
		}
		const checkUniqueBusinessLicenceInter = (rule, value, callback) => {
			const values = {
				code: null,
				businessLicence: value
			}
			checkUniqueBusinessLicence(rule, values, callback)
		}
		const checkValidEmployeeInternal = (rule, value, callback) => {
			const values = {
				code: value
			}
			checkValidEmployee(rule, values, callback)
		}
		const cacheSupplierAttach = () => {
			const fields = getFieldsValue()
			dispatch({
				type: "supplier/cacheSupplierAttach",
				payload: {
					businessLicenceAttach: fields.businessLicenceAttach,
					corporateCardAttach: fields.corporateCardAttach
				}
			})
		}
		const businessLicenceAttachProps = {
			showUploadList: false,
			multiple: false,
			name: "attach",
			action: `${fileApi.upload}`,
			headers: {
				authorization: "authorization-text"
			},
			data: {
				entityType: "supplier",
				key: "businessLicence"
			},
			beforeUpload(file) {
				const isImageFile = (file.type === "image/png" || file.type === "image/jpeg")
				if (!isImageFile) {
					notification.error({
						message: "错误",
						description: "请上传图片文件，仅支持jpg、png格式"
					})
				}
				return isImageFile
			},
			onChange(info) {
				if (info.file.status === "done") {
					const resp = info.file.response
					if (resp.success) {
						const path = resp.data
						const fields = getFieldsValue()
						fields.businessLicenceAttach = path
						setFieldsValue(fields)
						cacheSupplierAttach()
						notification.info({
							message: "上传成功"
						})
					} else {
						notification.info({
							message: "上传失败"
						})
					}
				} else if (info.file.status === "error") {
					notification.error({
						message: "上传失败"
					})
				}
			}
		}
		const corporateCardAttachProps = {
			showUploadList: false,
			multiple: false,
			name: "attach",
			action: `${fileApi.upload}`,
			headers: {
				authorization: "authorization-text"
			},
			data: {
				entityType: "supplier",
				key: "corporateCard"
			},
			beforeUpload(file) {
				const isImageFile = (file.type === "image/png" || file.type === "image/jpeg")
				if (!isImageFile) {
					notification.error({
						message: "错误",
						description: "请上传图片文件，仅支持jpg、png格式"
					})
				}
				return isImageFile
			},
			onChange(info) {
				if (info.file.status === "done") {
					const resp = info.file.response
					if (resp.success) {
						const path = resp.data
						const fields = getFieldsValue()
						fields.corporateCardAttach = path
						setFieldsValue(fields)
						cacheSupplierAttach()
						notification.info({
							message: "上传成功"
						})
					} else {
						notification.info({
							message: "上传失败"
						})
					}
				} else if (info.file.status === "error") {
					notification.error({
						message: "上传失败"
					})
				}
			}
		}
		// 获取供应商负责人员工
		const employeesAutoComplete = (value) => {
			dispatch({
				type: "selectEmployee/employeesAutoComplete",
				payload: {
					q: value
				},
				onComplete: (data) => {
					this.setState({
						ywLeaderOptions: data
					})
				}
			})
		}
		// 获取对账负责人员工
		const compareLeadersAutoComplete = (value) => {
			dispatch({
				type: "selectEmployee/employeesAutoComplete",
				payload: {
					q: value
				},
				onComplete: (data) => {
					this.setState({
						compareLeaderOptions: data
					})
				}
			})
		}
		const countryData = selectOptions.regions ? selectOptions.regions : []
		const countryOptions = countryData.map(country =>
			<Option key={country.id}>{country.chinesename}</Option>
		)
		//国家自动补全
		const handleSearch = (input, option) =>
			option.props.children.toLowerCase()
				.indexOf(input.toLowerCase()) >= 0
		const onSelect = (value) => {
			this.props.form.resetFields(["divisions"])
			dispatch({
				type: "administrativeDivision/options",
				payload: {regionId: value}
			})
		}
		const divisionData = selectOptions.divisionOptions ? selectOptions.divisionOptions : []
		// 省/市自动补全
		const filter = (inputValue, path) => path.some(option =>
			(option.label).toLowerCase()
				.indexOf(inputValue.toLowerCase()) > -1
		)
		const paymentCompanyFilter = (input, option) =>
			option.props.children.toLowerCase()
				.indexOf(input.toLowerCase()) >= 0
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
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
							{!viewLoading &&
							<Tabs
								defaultActiveKey="baseInfo"
								onChange={this.onChangeTabs}
								tabPosition="left"
							>
								<TabPane tab="基本信息" key="baseInfo">
									<div>
										{!record.id &&
										<Form.Item
											{...formItemLayout}
											label="供应商编码"
										>
											{getFieldDecorator("code", {
												initialValue: supplierCode,
												rules: [{
													required: true,
													message: "必填"
												}, {
													type: "string",
													pattern: /^[\da-zA-Z]+$/,
													message: "必须为数字或字母"
												}, {
													min: 2,
													max: 20,
													message: "必须为2~20个长度"
												}, {
													validator: checkUniqueCodeInter
												}]
											})(
												<Input onChange={this.handleSupplierCode}/>)
											}
										</Form.Item>
										}
										<Form.Item
											{...formItemLayout}
											label="供应商中文名称"
										>
											{getFieldDecorator("nameCh", {
												initialValue: record.nameCh,
												rules: [{
													required: true,
													message: "必填"
												}, {
													pattern: patterns.character,
													message: "只能包括中文字、英文字母、数字、括号和横线、下划线"
												}, {
													pattern: patterns.notStartWithDigit,
													message: "首位不能为数字"
												}, {
													min: 2,
													max: 64,
													message: "必须为2~64个长度"
												}, {
													validator: checkUniqueNameChInter
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="试运行阶段"
										>
											{getFieldDecorator("operationPhase", {
												initialValue: this.state.operationPhase,
												rules: [{
													required: true,
													message: "必填"
												}]
											})(
												<RadioGroup onChange={handleTrialChange}>
													{Array.from(OPERATION_PHASE)
														.map(([key, value]) =>
															(<RadioButton key={key} value={String(key)}>{value}</RadioButton>))}
												</RadioGroup>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="供应商类型"
										>
											{getFieldDecorator("supplierTypes", {
												initialValue: record.supplierType,
												rules: [{
													required: true,
													message: "必填"
												}]
											})(
												<Select mode="multiple">
													{Object.keys(selectOptions.supplierTypes)
														.map(key => (
															<Option key={key} value={key}>
																{selectOptions.supplierTypes[key]}
															</Option>
														))
													}
												</Select>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="境内/境外"
										>
											{getFieldDecorator("borderType", {
												initialValue: this.state.broaderType,
												rules: [{
													required: true,
													message: "必填"
												}]
											})(
												<RadioGroup onChange={handleBorderChange}>
													{Object.keys(selectOptions.borderTypes)
														.map(key => (
															<RadioButton key={key} value={key}>
																{selectOptions.borderTypes[key]}
															</RadioButton>
														))
													}
												</RadioGroup>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="所属区域"
										>
											{getFieldDecorator("productAreaType", {
												initialValue: record.productAreaType,
											})(
												<RadioGroup>
													{Object.keys(selectOptions.productAreaTypes)
														.map(key => (
															<RadioButton key={key} value={key}>
																{selectOptions.productAreaTypes[key]}
															</RadioButton>
														))
													}
												</RadioGroup>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="国家"
										>
											{getFieldDecorator("countryId", {
												initialValue: record.countryId,
												rules: [{
													required: true,
													message: "必填"
												}]
											})(
												<Select
													showSearch
													allowClear
													filterOption={handleSearch}
													onSelect={onSelect}
													placeholder="请选择">
													{countryOptions}
												</Select>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="行政区域"
										>
											{getFieldDecorator("divisions", {
												rules: [{
													required: isInBorder,
													message: "必填"
												}]
											})(
												<Cascader options={divisionData} showSearch={{filter}} placeholder="请选择"/>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="供应商英文名称"
										>
											{getFieldDecorator("nameEn", {
												initialValue: record.nameEn,
												rules: [{
													pattern: patterns.english,
													message: "只能包括英文字母、数字、括号和横线、下划线"
												}, {
													min: 2,
													max: 64,
													message: "必须为2~64个长度"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="供应商曾用名"
										>
											{getFieldDecorator("usedName", {
												initialValue: record.usedName,
												rules: [{
													pattern: patterns.character,
													message: "只能包括中文字、英文字母、数字、括号和横线、下划线"
												}, {
													pattern: patterns.notStartWithDigit,
													message: "首位不能为数字"
												}, {
													min: 2,
													max: 64,
													message: "必须为2~64个长度"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="公司名称"
										>
											{getFieldDecorator("companyName", {
												initialValue: record.companyName,
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}, {
													pattern: patterns.character,
													message: "只能包括中文字、英文字母、数字、括号和横线、下划线"
												}, {
													pattern: patterns.notStartWithDigit,
													message: "首位不能为数字"
												}, {
													min: 2,
													max: 256,
													message: "必须为2~256个长度"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="公司营业证件号"
										>
											{getFieldDecorator("businessLicence", {
												initialValue: record.businessLicence,
												rules: [{
													validator: checkUniqueBusinessLicenceInter
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Col offset={4}>
											<Form.Item
												{...formItemLayout}
											>
												<PictureView
													title="公司营业证件正面扫描件"
													previewImage={showBusinessLicenceAttach}
												>
													<span className={viewStyles.view}>
														<Icon title="查看" type="eye-o" className={viewStyles.viewIcon}/>正面
													</span>
												</PictureView>
												<Upload {...businessLicenceAttachProps}>
													<Button>
														<Icon type="upload"/> 上传
													</Button>
												</Upload>
											</Form.Item>
											<Form.Item
												style={{display: "none"}}
											>
												{getFieldDecorator("businessLicenceAttach", {
													initialValue: record.businessLicenceAttach
												})(<Input/>)}
											</Form.Item>
										</Col>
										<Form.Item
											{...formItemLayout}
											label="法人姓名"
										>
											{getFieldDecorator("corporateName", {
												initialValue: record.corporateName,
												rules: [{
													pattern: patterns.notStartWithDigit,
													message: "首位不能为数字"
												}, {
													pattern: patterns.character,
													message: "只能包括中文字、英文字母、数字、括号和横线、下划线"
												}, {
													min: 2,
													max: 64,
													message: "必须为2~64个长度"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="法人身份证号码"
										>
											{getFieldDecorator("corporateCard", {
												initialValue: record.corporateCard
											})(
												<Input/>)
											}
										</Form.Item>
										<Col offset={4}>
											<Form.Item
												{...formItemLayout}
											>
												<PictureView
													title="法人身份证正面扫描件"
													previewImage={showCorporateCardAttach}
												>
													<span className={viewStyles.view}>
														<Icon title="查看" type="eye-o" className={viewStyles.viewIcon}/>正面
													</span>
												</PictureView>
												<Upload {...corporateCardAttachProps}>
													<Button>
														<Icon type="upload"/> 上传
													</Button>
												</Upload>
											</Form.Item>
											<Form.Item
												style={{display: "none"}}
											>
												{getFieldDecorator("corporateCardAttach", {
													initialValue: record.corporateCardAttach
												})(<Input/>)}
											</Form.Item>
										</Col>
										<Form.Item
											{...formItemLayout}
											label="成立日期"
										>
											{getFieldDecorator("establishDate", {
												initialValue: record.establishDate
											})(
												<DatePicker/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="注册资金"
										>
											{getFieldDecorator("registeredCapital", {
												initialValue: record.registeredCapital,
												rules: [{
													type: "string",
													pattern: patterns.digit,
													message: "必须为合法数字"
												}, {
													max: 15,
													message: "必须为15个长度以内"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="公司地址"
										>
											{getFieldDecorator("address", {
												initialValue: record.address,
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}, {
													pattern: patterns.address,
													message: "必须为正确的地址"
												}, {
													min: 2,
													max: 150,
													message: "必须为2~150个长度"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="公司网址"
										>
											{getFieldDecorator("officialWebsite", {
												initialValue: record.officialWebsite,
												rules: [{
													type: "url",
													message: "必须为正确的网址"
												}, {
													max: 150,
													message: "必须为150个长度以内"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="邮编"
										>
											{getFieldDecorator("postcode", {
												initialValue: record.postcode,
												rules: [{
													pattern: patterns.zipCode,
													message: "必须为正确的邮政编码"
												}, {
													min: 5,
													max: 8,
													message: "必须为5~8个长度"
												}]
											})(
												<Input/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="燕文负责人"
										>
											{getFieldDecorator("leaderYw", {
												initialValue: record.leaderYw,
												rules: [{
													required: true,
													message: "必填"
												}, {
													validator: checkValidEmployeeInternal
												}]
											})(
												<AutoComplete
													allowClear
													placeholder="选择负责人"
													onSearch={employeesAutoComplete}
													dropdownMatchSelectWidth={false}
													dropdownStyle={{minWidth: 150}}
													dataSource={this.state.ywLeaderOptions.map(item =>
														(<AOption key={item.id}>{item.name}</AOption>)
													)}
												/>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="是否启用"
										>
											{getFieldDecorator("enable", {
												initialValue: record.enable || 1,
												rules: [{
													required: true,
													message: "必填"
												}]
											})(
												<RadioGroup>
													<Radio value={1}>是</Radio>
													<Radio value={0}>否</Radio>
												</RadioGroup>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="公司介绍"
										>
											{getFieldDecorator("introduction", {
												initialValue: record.introduction
											})(
												<TextArea autosize={{minRows: 3, maxRows: 6}}/>)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="对账负责人"
										>
											{getFieldDecorator("compareLeader", {
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}, {
													validator: checkValidEmployeeInternal
												}]
											})(
												<AutoComplete
													allowClear
													placeholder="选择负责人"
													onSearch={compareLeadersAutoComplete}
													dropdownMatchSelectWidth={false}
													dropdownStyle={{minWidth: 150}}
													dataSource={this.state.compareLeaderOptions.map(item =>
														(<AOption key={item.id}>{item.name}</AOption>)
													)}
												/>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="燕文付款公司"
										>
											{getFieldDecorator("companyIds", {
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}]
											})(
												<Select mode="multiple" filterOption={paymentCompanyFilter}>
													{selectOptions.companies.map(item =>
														(<Option key={item.id}>{item.name}</Option>)
													)}
												</Select>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="付款方式"
										>
											{getFieldDecorator("paymentTerm", {
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}]
											})(
												<RadioGroup>
													{Object.keys(selectOptions.paymentTerms)
														.map(key => (
															<RadioButton key={key} value={key}>
																{selectOptions.paymentTerms[key]}
															</RadioButton>
														))
													}
												</RadioGroup>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="付款周期"
										>
											{getFieldDecorator("payCycle", {
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}]
											})(
												<RadioGroup>
													{Object.keys(selectOptions.supplierPayCycles)
														.map(key =>
															(<RadioButton key={key} value={key}>
																{selectOptions.supplierPayCycles[key]}
															</RadioButton>)
														)}
												</RadioGroup>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="付款币种"
										>
											{getFieldDecorator("currencyId", {
												rules: [{
													required: !isTrialPhase,
													message: "必填"
												}]
											})(
												<Select>
													{selectOptions.currencies.map(item =>
														(<Option key={item.id}>{item.name}</Option>)
													)}
												</Select>
											)
											}
										</Form.Item>
										<Form.Item
											{...formItemLayout}
											label="备注"
										>
											{getFieldDecorator("mark", {})(<TextArea rows={4}/>)
											}
										</Form.Item>
									</div>
								</TabPane>
							</Tabs>
							}
						</Spin>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
