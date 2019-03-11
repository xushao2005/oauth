/* eslint-disable react/no-multi-comp */
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
	Row,
	Select,
	Spin,
	Tabs,
	Tag,
	Upload
} from "antd"
import classnames from "classnames"
import {connect} from "dva"
import moment from "moment"
import {styles} from "../../components/layouts"
import ContactIndex from "./contact/index"
import FinanceAndContractIndex from "./financeAndContract/index"
import viewStyles from "./view.less"
import PictureView from "../../components/data/pictureView"
import {fileApi} from "../../constants/api"
import {patterns} from "../../utils/form"
import {checkUniqueBusinessLicence, checkUniqueNameCh} from "../../validators/supplier/supplier"
import {elementAuth} from "../../utils/auth"
import {checkValidEmployee} from "../../validators/employee"
import OPERATION_PHASE from "../../constants/operationPhase"

const AOption = AutoComplete.Option
const Option = Select.Option
const RadioButton = Radio.Button
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const TextArea = Input.TextArea
const SupplierHeader = ({supplier}) => {
	const {currentSupplier} = supplier
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
	return (
		<Form>
			<Row>
				<Form.Item
					{...formItemLayout}
					label="供应商中文名称："
				>
					{currentSupplier.nameCh}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="供应商编码："
				>
					{currentSupplier.code}
				</Form.Item>
			</Row>
			<hr style={{marginTop: "10px", marginBottom: "5px"}}/>
		</Form>
	)
}

class SupplierBody extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		const {
			dispatch, supplier, form, selectSupplierTypes,
			selectBorderTypes, selectProductAreaTypes,
			selectEmployee, selectRegion, administrativeDivision
		} = this.props
		const selectOptions = {
			...selectSupplierTypes,
			...selectBorderTypes,
			...selectProductAreaTypes,
			...selectRegion,
			...administrativeDivision
		}
		const {currentSupplier, editable, cacheSupplier} = supplier
		const {businessLicenceAttach, corporateCardAttach} = cacheSupplier
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
		const {getFieldDecorator, getFieldsValue, validateFields, setFieldsValue} = form
		let showBusinessLicenceAttach
		if (businessLicenceAttach) {
			showBusinessLicenceAttach = businessLicenceAttach
		} else {
			showBusinessLicenceAttach = currentSupplier.businessLicenceAttach
		}
		let showCorporateCardAttach
		if (corporateCardAttach) {
			showCorporateCardAttach = corporateCardAttach
		} else {
			showCorporateCardAttach = currentSupplier.corporateCardAttach
		}
		const checkUniqueNameChInter = (rule, value, callback) => {
			const {code} = currentSupplier
			const values = {
				code: code,
				nameCh: value
			}
			checkUniqueNameCh(rule, values, callback)
		}
		const checkUniqueBusinessLicenceInter = (rule, value, callback) => {
			const {code} = currentSupplier
			const values = {
				code: code,
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
		const supplierTypeArray = currentSupplier.supplierTypes.map(it => String(it))
		const supplierTypeTags = (array) => {
			const tags = []
			array.reduce((previous, current) => {
				const key = current
				previous.push(<Tag key={key}>{selectOptions.supplierTypes[key]}</Tag>)
				return previous
			}, tags)
			return tags
		}
		// 获取员工
		const employeesAutoComplete = (value) => {
			dispatch({
				type: "selectEmployee/employeesAutoComplete",
				payload: {
					q: value
				}
			})
		}
		const countryData = selectOptions.regions.length > 0
			? selectOptions.regions
			: []
		const countryOptions = countryData.map(country =>
			<AOption key={country.id}>{country.chinesename}</AOption>
		)
		//国家自动补全
		const handleSearch = (input, option) =>
			option.props.children.toLowerCase()
				.indexOf(input.toLowerCase()) >= 0
		const onSelect = (value) => {
			form.resetFields(["divisions"])
			dispatch({
				type: "administrativeDivision/options",
				payload: {regionId: value}
			})
		}
		const currentCountry = countryData.find(item => item.id === currentSupplier.countryId)
		const countryName = currentCountry ? currentCountry.chinesename : ""
		// 省/市自动补全
		const filter = (inputValue, path) => path.some(option =>
			(option.label).toLowerCase()
				.indexOf(inputValue.toLowerCase()) > -1
		)
		// 拼接"省/市"
		const concatDivision = (parent, child) => {
			let division = ""
			if (parent) {
				division += parent
			}
			if (parent && child) {
				division = division.concat("/")
			}
			if (child) {
				division += child
			}
			return division
		}
		const concatDivisionId = (parent, child) => {
			const division = []
			if (parent) {
				division.push(parent)
			}
			if (child) {
				division.push(child)
			}
			return division
		}
		// 默认值
		const provinceAndCityId = concatDivisionId(currentSupplier.provinceId, currentSupplier.cityId)
		const provinceName = currentSupplier.provinceName
		const cityName = currentSupplier.cityName
		const provinceAndCityName = concatDivision(provinceName, cityName)
		//省市选项
		const divisionData = selectOptions.divisionOptions.length ? selectOptions.divisionOptions : []
		const fileds = getFieldsValue()

		let isTrialPhase = true
		if (fileds.operationPhase) {
			isTrialPhase = this.state.operationPhase === "1"
		}
		let isInBorder = true
		if (fileds.borderType) {
			if (this.state.borderType) {
				isInBorder = this.state.borderType === "1"
			} else {
				isInBorder = currentSupplier.borderType === 1
			}
		}
		const handleBorderChange = (e) => {
			this.setState(
				{borderType: e.target.value},
				() => {
					validateFields(["divisions"], {force: true})
				})
		}
		const handleTrialChange = (e) => {
			this.setState(
				{operationPhase: e.target.value},
				() => {
					validateFields(["companyName", "address"], {force: true})
				})
		}
		return (
			<Form>
				<Row>
					{editable && <Form.Item
						{...formItemLayout}
						label="供应商中文名称："
					>
						{getFieldDecorator("nameCh", {
							initialValue: currentSupplier.nameCh,
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
						})(<Input/>)}
					</Form.Item>}
					<Form.Item
						{...formItemLayout}
						label="试运行阶段"
					>
						{editable
							? getFieldDecorator("operationPhase", {
								initialValue: String(currentSupplier.operationPhase || "1"),
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
							: OPERATION_PHASE.get(Number(currentSupplier.operationPhase))
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="供应商类型"
					>
						{editable
							? getFieldDecorator("supplierTypes", {
								initialValue: supplierTypeArray,
								rules: [{
									required: true,
									message: "必填"
								}]
							})(
								<Select mode="multiple">
									{Object.keys(selectOptions.supplierTypes)
										.map(key => (
											<Option key={key} value={String(key)}>
												{selectOptions.supplierTypes[key]}
											</Option>
										))
									}
								</Select>
							)
							: supplierTypeTags(supplierTypeArray)
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="境内/境外"
					>
						{editable
							? getFieldDecorator("borderType", {
								initialValue: (currentSupplier.borderType || "").toString(),
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
							: selectOptions.borderTypes[currentSupplier.borderType]
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="所属区域"
					>
						{editable
							? getFieldDecorator("productAreaType", {
								initialValue: (currentSupplier.productAreaType || "").toString(),
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
							: selectOptions.productAreaTypes[currentSupplier.productAreaType]
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="国家"
					>
						{editable
							? getFieldDecorator("countryId", {
								initialValue: currentSupplier.countryId,
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
							: countryName
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="行政区域"
					>
						{editable
							? getFieldDecorator("divisions", {
								initialValue: provinceAndCityId,
								rules: [{
									required: isInBorder,
									message: "必填"
								}]
							})(
								<Cascader options={divisionData} showSearch={{filter}} placeholder="请选择"/>
							)
							: provinceAndCityName
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="供应商英文名"
					>
						{editable
							? getFieldDecorator("nameEn", {
								initialValue: currentSupplier.nameEn,
								rules: [{
									pattern: patterns.english,
									message: "只能包括英文字母、数字、括号和横线、下划线"
								}, {
									min: 2,
									max: 64,
									message: "必须为2~64个长度"
								}]
							})(<Input/>)
							: currentSupplier.nameEn}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="供应商曾用名"
					>
						{editable
							? getFieldDecorator("usedName", {
								initialValue: currentSupplier.usedName,
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
							})(<Input/>)
							: currentSupplier.usedName}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司名称"
					>
						{editable
							? getFieldDecorator("companyName", {
								initialValue: currentSupplier.companyName,
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
							})(<Input/>)
							: currentSupplier.companyName}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司营业证件号"
					>
						{editable
							? getFieldDecorator("businessLicence", {
								initialValue: currentSupplier.businessLicence,
								rules: [{
									validator: checkUniqueBusinessLicenceInter
								}]
							})(<Input/>)
							:
							<span>{currentSupplier.businessLicence}
								<PictureView
									title="公司营业证件正面扫描件"
									previewImage={currentSupplier.businessLicenceAttach}
								>
									<span className={viewStyles.view}>
										<Icon title="查看" type="eye-o" className={viewStyles.viewIcon}/>正面
									</span>
								</PictureView>
							</span>}
					</Form.Item>
					{editable &&
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
									<Icon type="upload"/> 更新
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item
							style={{display: "none"}}
						>
							{getFieldDecorator("businessLicenceAttach", {
								initialValue: currentSupplier.businessLicenceAttach
							})(<Input/>)}
						</Form.Item>
					</Col>}
					<Form.Item
						{...formItemLayout}
						label="法人姓名"
					>
						{editable
							? getFieldDecorator("corporateName", {
								initialValue: currentSupplier.corporateName,
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
							})(<Input/>)
							: currentSupplier.corporateName}
					</Form.Item>
					{editable &&
					<Col offset={4}>
						<Form.Item
							{...formItemLayout}
						>
							<PictureView
								title="公司法人证件正面扫描件"
								previewImage={showCorporateCardAttach}
							>
								<span className={viewStyles.view}>
									<Icon title="查看" type="eye-o" className={viewStyles.viewIcon}/>正面
								</span>
							</PictureView>
							<Upload {...corporateCardAttachProps}>
								<Button>
									<Icon type="upload"/> 更新
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item
							style={{display: "none"}}
						>
							{getFieldDecorator("corporateCardAttach", {
								initialValue: currentSupplier.corporateCardAttach
							})(<Input/>)}
						</Form.Item>
					</Col>}
					<Form.Item
						{...formItemLayout}
						label="法人身份证号码"
					>
						{editable
							? getFieldDecorator("corporateCard", {
								initialValue: currentSupplier.corporateCard
							})(<Input/>)
							:
							<span>{currentSupplier.corporateCard}
								<PictureView
									title="法人身份证正面扫描件"
									previewImage={currentSupplier.corporateCardAttach}
								>
									<span className={viewStyles.view}>
										<Icon title="查看" type="eye-o" className={viewStyles.viewIcon}/>正面
									</span>
								</PictureView>
							</span>}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司地址"
					>
						{editable
							? getFieldDecorator("address", {
								initialValue: currentSupplier.address,
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
							})(<Input/>)
							: currentSupplier.address}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司网址"
					>
						{editable
							? getFieldDecorator("officialWebsite", {
								initialValue: currentSupplier.officialWebsite,
								rules: [{
									type: "url",
									message: "必须为正确的网址"
								}, {
									max: 150,
									message: "必须为150个长度以内"
								}]
							})(<Input/>)
							: currentSupplier.officialWebsite}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="邮编"
					>
						{editable
							? getFieldDecorator("postcode", {
								initialValue: currentSupplier.postcode,
								rules: [{
									pattern: patterns.zipCode,
									message: "必须为正确的邮政编码"
								}, {
									min: 5,
									max: 8,
									message: "必须为5~8个长度"
								}]
							})(<Input/>)
							: currentSupplier.postcode}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="成立时间"
					>
						{editable
							? getFieldDecorator("createTime", {
								initialValue: currentSupplier.createTime === null ? null :
									moment(currentSupplier.createTime),
								rules: []
							})(<DatePicker/>)
							: currentSupplier.createTime}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="注册资金"
					>
						{editable
							? getFieldDecorator("registeredCapital", {
								initialValue: currentSupplier.registeredCapital,
								rules: [{
									pattern: patterns.digit,
									message: "必须为合法数字"
								}]
							})(<Input/>)
							: currentSupplier.registeredCapital}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="燕文负责人"
					>
						{editable
							? getFieldDecorator("leaderYw", {
								initialValue: (currentSupplier.leaderYw || "").toString(),
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
									dataSource={selectEmployee.employees.length > 0
										? selectEmployee.employees.map(item =>
											(<AOption key={item.id}>{item.name}</AOption>)
										)
										: (currentSupplier.leaderYw && [(<AOption key={currentSupplier.leaderYw}>
											{currentSupplier.leaderNameYW}</AOption>)])
									}
								/>
							)
							: currentSupplier.leaderNameYW
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="是否启用"
					>
						{editable
							? getFieldDecorator("enable", {
								initialValue: currentSupplier.enable ? 1 : 0,
								rules: [{
									required: true,
									message: "必填"
								}]
							})(
								<RadioGroup>
									<Radio value={1}>是</Radio>
									<Radio value={0}>否</Radio>
								</RadioGroup>)
							: <span>{currentSupplier.enable ? "是" : "否"}</span>}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司介绍"
					>
						{editable
							? getFieldDecorator("introduction", {
								initialValue: currentSupplier.introduction
							})(
								<TextArea autosize={{minRows: 3, maxRows: 6}}/>)
							: currentSupplier.introduction}
					</Form.Item>
				</Row>
			</Form>
		)
	}
}

const mapStateToProps = ({
													 supplier, selectSupplierTypes, selectBorderTypes,
													 selectProductAreaTypes, selectEmployee,
													 selectRegion,
													 administrativeDivision, resource, loading
												 }) =>
	({
		supplier,
		selectSupplierTypes,
		selectBorderTypes,
		selectProductAreaTypes,
		selectEmployee,
		selectRegion,
		administrativeDivision,
		resource,
		loading
	})

const ConnectedSupplierHeader = connect(mapStateToProps)(SupplierHeader)

const ConnectedSupplierBody =
	connect(mapStateToProps, null, null, {withRef: true})(Form.create()(SupplierBody))

class ViewModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	// tabs切换事件
	onChangeTabs = (tab) => {
		const {dispatch, payload: {id}} = this.props
		if (tab === "contact") {
			dispatch({
				type: "supplier/saveMainTab",
				payload: false
			})
			dispatch({
				type: "supplierContact/query",
				payload: {
					supplierCode: id
				}
			})
		} else if (tab === "financeAndContractIndex") {
			dispatch({
				type: "supplier/savePaymentTab",
				payload: true
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: true
			})
			dispatch({
				type: "selectCompany/selection"
			})
			dispatch({
				type: "selectCurrency/selection"
			})
			dispatch({
				type: "selectEmployee/saveEmployees",
				payload: []
			})
		} else {
			dispatch({
				type: "selectEmployee/saveEmployees",
				payload: []
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
			dispatch({
				type: "supplier/savePaymentTab",
				payload: false
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: true
			})
		}
	}

	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		dispatch({
			type: "supplier/view",
			payload: {id: payload.id}
		})
		dispatch({
			type: "selectRegion/selection",
			payload: {
				p: "1"
			}
		})
		dispatch({
			type: "selectEmployee/saveEmployees",
			payload: []
		})
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
		this.makeUnEditable()
	}
	makeEditableHandler = () => {
		const {dispatch, payload} = this.props
		dispatch({
			type: "supplier/makeEditable"
		})
		if (payload.countryId) {
			dispatch({
				type: "administrativeDivision/options",
				payload: {regionId: payload.countryId}
			})
		}
	}
	okHandler = () => {
		const {onOk, paymentTab} = this.props
		let form
		if (paymentTab) {
			form = this.paymentInfoForm.wrappedInstance
		} else {
			form = this.baseInfoForm.wrappedInstance
		}
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				//基础信息页面
				if (values.createTime) {
					values.createTime = `${values.createTime.format("YYYY-MM-DD")} 00:00:00`
				}
				const divisions = values.divisions
				if (divisions) {
					if (divisions.length === 2) {
						values.provinceId = divisions[0]
						values.cityId = divisions[1]
					} else if (divisions.length === 1) {
						values.cityId = divisions[0]
					}
				}
				//合同及财务页面
				if (values.isPaymentInfo) {
					const companyIds = values.companyIds
					values.companies = companyIds.map(id => (
						{companyDepartmentCode: id}
					))
				}
				onOk(lodash.omit(values, ["companyIds", "divisions"]))
				this.makeUnEditable()
			}
		})
	}
	makeUnEditable = () => {
		const {dispatch} = this.props
		dispatch({
			type: "supplier/makeUnEditable"
		})
		dispatch({
			type: "supplier/clearCacheSupplierAttach"
		})
		dispatch({
			type: "supplier/savePaymentTab",
			payload: false
		})
	}
	cancelHandler = () => {
		this.makeUnEditable()
	}

	render() {
		const {children, title, location, editable, mainTab, resource, payload, dispatch} = this.props
		let {viewLoading, updateLoading} = this.props
		if (viewLoading === undefined) {
			viewLoading = false
		}
		if (updateLoading === undefined) {
			updateLoading = false
		}

		const reqProps = {location}
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
					visible={this.state.visible}
					footer={
						editable && mainTab ?
							<div>
								<Button onClick={this.okHandler} type="primary" size="large">保存</Button>
								<Button onClick={this.cancelHandler} size="large">取消</Button>
							</div>
							:
							<div>
								{elementAuth(location, "编辑供应商", resource.currentResources) && mainTab &&
								<Button onClick={this.makeEditableHandler} type="primary" size="large">编辑</Button>}
								<Button onClick={this.hideModelHandler} size="large">关闭</Button>
							</div>
					}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
				>
					<Spin spinning={viewLoading || updateLoading}>
						{!viewLoading && !updateLoading &&
						<div>
							<ConnectedSupplierHeader/>
							<Tabs
								defaultActiveKey="baseInfo"
								onChange={this.onChangeTabs}
								tabPosition="left"
								style={{marginBottom: "53px"}}
							>
								<TabPane tab="基本信息" key="baseInfo">
									<ConnectedSupplierBody ref={(child) => {
										this.baseInfoForm = child
									}}/>
								</TabPane>
								<TabPane tab="联系人信息" key="contact">
									<ContactIndex {...reqProps}/>
								</TabPane>
								<TabPane tab="合同及财务信息" key="financeAndContractIndex">
									<FinanceAndContractIndex
										payload={payload}
										dispatch={dispatch}
										paymentInfoForm={(child) => {
											this.paymentInfoForm = child
										}}
										{...reqProps}/>
								</TabPane>
							</Tabs>
						</div>}
					</Spin>
				</Modal>}
			</span>
		)
	}
}

export default ViewModal
