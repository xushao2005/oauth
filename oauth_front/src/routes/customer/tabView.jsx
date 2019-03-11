import React, {Component} from "react"
import {
	AutoComplete,
	Button,
	Col,
	Form,
	Icon,
	Input,
	Modal,
	notification,
	Popconfirm,
	Popover,
	Progress,
	Radio,
	Row,
	Spin,
	Switch,
	Tabs,
	Upload
} from "antd"
import classnames from "classnames"
import {connect} from "dva"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {styles} from "../../components/layouts"
import SaleIndex from "./sale/index"
import FinanceIndex from "./finance/index"
import ContactIndex from "./contact/index"
import ConsignorIndex from "./consignor/index"
import PlatformIndex from "./platform/index"
import CustomerLogIndex from "./log/index"
import tabViewLess from "./tabView.less"
import PictureView from "../../components/data/pictureView"
import {fileApi, menus} from "../../constants/api"
import CascaderAddress from "../../components/data/cascaderAddress"
import {checkCascaderAddress} from "../../validators/cascaderAddress"
import TabForm from "./tabForm"
import {patterns} from "../../utils/form"
import {checkIntroducerCode, checkUniqueNameCh} from "../../validators/customer/customer"
import {elementAuth} from "../../utils/auth"
import PLATFORM_CONSTANTS from "../../constants/platform"

const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const AOption = AutoComplete.Option
const { TextArea } = Input

// 编辑头部
const CustomerHeader = ({dispatch, customer, location, resource}) => {
	const {currentCustomer} = customer
	let integrityPercent = 100
	let integrityContent = <div>您的资料完整度是100%</div>
	if (integrityPercent === 100 && !currentCustomer.signedWithYanwen) {
		integrityContent = <div>请进行转正操作！</div>
	}
	if (currentCustomer.integrity && currentCustomer.integrity.length) {
		integrityPercent = (5 - currentCustomer.integrity.length) / 5 * 100
		integrityContent = currentCustomer.integrity.map(item => (
			<li key={item}>{item}</li>
		))
		integrityContent = (<div><h3>您缺少以下资料：</h3><ol type="1">
			{
				currentCustomer.integrity.map((item, index) => (
					<li key={item}>{index + 1}.{item}</li>
				))
			}
		</ol></div>)
	}
	// 初始化
	const updateHandler = (values) => {
		dispatch({
			type: "customer/customerTypeInit",
			payload: {...values}
		})
	}
	// 转正
	const onCustomerSignVo = (checked) => {
		dispatch({
			type: "customer/customerSignVo",
			payload: {
				customerCode: currentCustomer.customerCode,
				signedWithYanwen: checked
			}
		})
		dispatch(routerRedux.replace({
			pathname: menus.customers,
			search: queryString.stringify({
				do: 1,
				signedWithYanwen: true,
				customerCode: currentCustomer.customerCode
			})
		}))
	}
	// 解冻
	const onCustomerAutoDefrostVo = (checked) => {
		dispatch({
			type: "customer/customerAutoDefrostVo",
			payload: {
				customerCode: currentCustomer.customerCode,
				autoDefrost: checked
			}
		})
	}
	const formItemLayout = {
		labelCol: {
			xs: {span: 24},
			sm: {span: 12}
		},
		wrapperCol: {
			xs: {span: 24},
			sm: {span: 12}
		},
		style: {
			maxWidth: 600,
			margin: "16px auto",
		}
	}
	const switchLayout = {
		labelCol: {
			xs: {span: 24},
			sm: {span: 24}
		},
		wrapperCol: {
			xs: {span: 24},
			sm: {span: 24}
		},
		style: {
			width: 150,
			margin: "16px auto",
			fontSize: "20px"
		}
	}
	const customerFormLayout = {
		labelCol: {
			xs: {span: 24},
			sm: {span: 6}
		},
		wrapperCol: {
			xs: {span: 24},
			sm: {span: 18}
		},
		style: {
			maxWidth: 600,
			margin: "16px auto",
			textOverflow: "ellipsis",
			overflow: "hidden",
			fontSize: "20px"
		}
	}
	const content = (
		<div>
			<p>当客户状态为“支持自动解冻”,</p>
			<p>允许账务中心向主数据中心发起“ejf解冻”请求，</p>
			<p>否则拒绝接受账务中心的请求。</p>
		</div>
	)
	const clearPersonalModel = {
		// customerCode: "10002477",
		// customerName: "客户名称",
		customerServiceLevel: null,
		introducer: null,
		personalCard: null,
		personalCardAttatch: null,
		personalCardBackAttatch: null,
		personalName: null,
		registeredAddress: null,
		remark: null,
		returnCity: null,
		returnDistrict: null,
		returnProvince: null,
		returnStreetAddress: null,
		source: null
	}
	const clearCompanyModel = {
		// customerCode: "30011834",
		corporateCardAttatch: null,
		corporateCardBackAttatch: null,
		businessLicenceAttatch: null,
		// customerName: "客户名称",
		companyName: null,
		corporateName: null,
		corporateCard: null,
		businessLicence: null,
		registeredAddress: null,
		customerServiceLevel: null,
		source: null,
		introducer: null,
		// remark: "备注备注备注",
		returnProvince: null,
		returnCity: null,
		returnDistrict: null,
		returnStreetAddress: null
	}
	//"转个人，企业信息清空"
	const handleChangeToPersonal = () => {
		dispatch({
			type: "customer/changeToPersonal",
			payload: {
				...clearCompanyModel,
				customerCode: currentCustomer.customerCode,
				customerType: 0
			}
		})
	}
	//"转企业，个人信息清空"
	const handleChangeToCompany = () => {
		dispatch({
			type: "customer/changeToCompany",
			payload: {
				...clearPersonalModel,
				customerCode: currentCustomer.customerCode,
				customerType: 1
			}
		})
	}
	//支持单个活动客户的冻结功能
	const handleChangeEJFStatusFrozen = () => {
		dispatch({
			type: "customer/ejfStatusFrozen",
			payload: {
				customerCode: currentCustomer.customerCode
			}
		})
	}
	return (
		<Form>
			{currentCustomer.customerType !== undefined
				?
				<Row>
					<Col span={6} offset={3}>
						<Form.Item
							{...customerFormLayout}
							label="客户名称: "
						>
							{currentCustomer.customerName}
							{currentCustomer.signedWithYanwen ?
								<span className={tabViewLess.primaryLabel}>正式客户</span> :
								<span className={tabViewLess.warningLabel}>非正式客户</span>
							}
						</Form.Item>
						<Form.Item
							{...customerFormLayout}
							label="客户类型: "
						>
							{currentCustomer.customerTypeName}
							{elementAuth(location, "客户类型转换", resource.currentResources) && <Popconfirm
								title={<span className={tabViewLess.red}>注意！将清空客户基本信息，数据不可恢复</span>}
								onConfirm={currentCustomer.customerType
									? handleChangeToPersonal
									: handleChangeToCompany}
							>
								<span className={tabViewLess.changeType}>
									<Icon type="retweet" className={tabViewLess.mrl}/>{currentCustomer.customerType ? "转个人" : "转企业"}
								</span>
							</Popconfirm>}
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item
							{...formItemLayout}
							label="EJF状态: "
						>
							{currentCustomer.ejfStatusDesc}
							{elementAuth(location, "EJF状态冻结", resource.currentResources)
								&& currentCustomer.ejfStatus === 1
								&& <Popconfirm
									title={<span>确定将EJF状态冻结？</span>}
									onConfirm={handleChangeEJFStatusFrozen}
								>
									<Button type="ghost" size="small" className={tabViewLess.mrl}>冻结此客户</Button>
								</Popconfirm>}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="TMS状态: "
						>
							{currentCustomer.tmsStatusDesc}
						</Form.Item>
					</Col>
					{elementAuth(location, "编辑财务信息", resource.currentResources) && <Col span={4} className={tabViewLess.center}>
						<Form.Item
							{...switchLayout}
						>
							<Switch
								defaultChecked={currentCustomer.autoDefrost}
								checkedChildren="支持自动解冻"
								unCheckedChildren="不支持自动解冻"
								onChange={onCustomerAutoDefrostVo}
							/>
							<Popover content={content} placement="bottomRight">
								<Icon type="question-circle-o" className={tabViewLess.question}/>
							</Popover>
						</Form.Item>
					</Col>}
					<Col span={5} className={tabViewLess.progress}>
						<Progress
							type="circle"
							width={110}
							percent={
								(integrityPercent === 100 && !currentCustomer.signedWithYanwen) ?
									95 : integrityPercent
							}
							format={percent => (<span>
								{percent}%&nbsp;
								<Popover content={integrityContent}>
									<Icon style={{fontSize: 12}} type="question-circle-o"/>
								</Popover>
							</span>)}/>
					</Col>
					{elementAuth(location, "编辑客户", resource.currentResources) && !currentCustomer.signedWithYanwen &&
					<Col>
						<Switch
							defaultChecked={currentCustomer.signedWithYanwen}
							checkedChildren="正式"
							unCheckedChildren="非正式"
							style={{marginTop: "50px"}}
							onChange={onCustomerSignVo}
							disabled={!(integrityPercent === 100 && !currentCustomer.signedWithYanwen)}
						/>
					</Col>}
				</Row>
				:
				<Row>
					<Col span={6} offset={4}>
						<Form.Item
							{...customerFormLayout}
							label="客户名称: "
						>
							{currentCustomer.customerName}
							{currentCustomer.signedWithYanwen ?
								<span className={tabViewLess.primaryLabel}>正式客户</span> :
								<span className={tabViewLess.warningLabel}>非正式客户</span>
							}
						</Form.Item>
					</Col>
					<Col span={6}>
						{elementAuth(location, "编辑客户", resource.currentResources) &&
							<Form.Item
								{...formItemLayout}
								label="点击进行客户信息初始化"
							>
								<TabForm
									title="请选择初始化客户类型"
									dispatch={dispatch}
									currentCustomer={currentCustomer}
									onOk={updateHandler}
								>
									<Button type="primary">初始化</Button>
								</TabForm>
							</Form.Item>
						}
					</Col>
					<Col span={2} className={tabViewLess.progress}>
						<Progress
							type="circle"
							width={110}
							percent={
								(integrityPercent === 100 && !currentCustomer.signedWithYanwen) ?
									95 : integrityPercent
							}
							format={percent => (<span>
								{percent}%&nbsp;
								<Popover content={integrityContent}>
									<Icon style={{fontSize: 12}} type="question-circle-o"/>
								</Popover>
							</span>)}/>
					</Col>
				</Row>
			}
			<hr style={{marginTop: "10px", marginBottom: "5px"}}/>
		</Form>
	)
}
// 编辑主体
const CustomerBody = ({dispatch, customer, form, selectEmployee, administrativeDivision}) => {
	const {currentCustomer, editable} = customer
	const {customerCode} = currentCustomer
	const {getFieldDecorator, getFieldsValue, setFieldsValue} = form
	const {generateDistrictRaw: districts} = administrativeDivision
	// 获取介绍人
	const employeesAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/employeesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	const checkReturnAddress = (rule, value, callback) => {
		checkCascaderAddress(rule, value, callback)
	}
	// 客户名唯一性验证相关
	const checkUniqueNameChInter = (rule, value, callback) => {
		const values = {
			customerCode: customerCode,
			customerName: value
		}
		checkUniqueNameCh(rule, values, callback)
	}
	// 校验 介绍人存在
	const checkIntroducerCodeInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkIntroducerCode(rule, values, callback)
	}
	// 上传图片
	let personalCardAttatch // 个人正面
	let personalCardBackAttatch // 个人背面
	if (currentCustomer.personalCardAttatch) {
		personalCardAttatch = currentCustomer.personalCardAttatch
	}
	if (currentCustomer.personalCardBackAttatch) {
		personalCardBackAttatch = currentCustomer.personalCardBackAttatch
	}
	let corporateCardAttatch // 法人正面
	let corporateCardBackAttatch // 法人背面
	let businessLicenceAttatch // 公司营业证件
	if (currentCustomer.corporateCardAttatch) {
		corporateCardAttatch = currentCustomer.corporateCardAttatch
	}
	if (currentCustomer.corporateCardBackAttatch) {
		corporateCardBackAttatch = currentCustomer.corporateCardBackAttatch
	}
	if (currentCustomer.businessLicenceAttatch) {
		businessLicenceAttatch = currentCustomer.businessLicenceAttatch
	}
	const currentCustomerAttach = () => {
		const fields = getFieldsValue()
		dispatch({
			type: "customer/saveCurrentCustomer",
			payload: {
				personalCardAttatch: fields.personalCardAttatch,
				personalCardBackAttatch: fields.personalCardBackAttatch,
				corporateCardAttatch: fields.corporateCardAttatch,
				corporateCardBackAttatch: fields.corporateCardBackAttatch,
				businessLicenceAttatch: fields.businessLicenceAttatch
			}
		})
	}
	const uploadPersonalCardAttatch = {
		showUploadList: false,
		multiple: false,
		name: "attach",
		action: `${fileApi.upload}`,
		headers: {
			authorization: "authorization-text"
		},
		data: {
			entityType: "customer",
			key: "personalCardAttatch"
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
					fields.personalCardAttatch = path
					setFieldsValue(fields)
					currentCustomerAttach()
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
	const uploadPersonalCardBackAttatch = {
		showUploadList: false,
		multiple: false,
		name: "attach",
		action: `${fileApi.upload}`,
		headers: {
			authorization: "authorization-text"
		},
		data: {
			entityType: "customer",
			key: "personalCardBackAttatch"
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
					fields.personalCardBackAttatch = path
					setFieldsValue(fields)
					currentCustomerAttach()
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
	const uploadCorporateCardAttatch = {
		showUploadList: false,
		multiple: false,
		name: "attach",
		action: `${fileApi.upload}`,
		headers: {
			authorization: "authorization-text"
		},
		data: {
			entityType: "customer",
			key: "corporateCardAttatch"
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
					fields.corporateCardAttatch = path
					setFieldsValue(fields)
					currentCustomerAttach()
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

	const checkUniqueAdminPhone = (rule, value, callback) => {
		dispatch({
			type: "customer/adminPhoneExists",
			payload: {
				adminPhone: value,
				customerCode
			}
		})
			.then((res) => {
				if (res) {
					callback()
				} else {
					callback("该手机号码已被使用")
				}
			})
	}

	const uploadCorporateCardBackAttatch = {
		showUploadList: false,
		multiple: false,
		name: "attach",
		action: `${fileApi.upload}`,
		headers: {
			authorization: "authorization-text"
		},
		data: {
			entityType: "customer",
			key: "corporateCardBackAttatch"
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
					fields.corporateCardBackAttatch = path
					setFieldsValue(fields)
					currentCustomerAttach()
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
	const uploadBusinessLicenceAttatch = {
		showUploadList: false,
		multiple: false,
		name: "attach",
		action: `${fileApi.upload}`,
		headers: {
			authorization: "authorization-text"
		},
		data: {
			entityType: "customer",
			key: "businessLicenceAttatch"
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
					fields.businessLicenceAttatch = path
					setFieldsValue(fields)
					currentCustomerAttach()
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
	const handleSource = () => {
	}
	return (
		<Form>
			<Row>
				{editable && <Form.Item
					{...formItemLayout}
					label="客户名称"
				>
					{editable
						&& getFieldDecorator("customerName", {
							initialValue: currentCustomer.customerName,
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
								max: 50,
								message: "必须为2~50个长度"
							}, {
								validator: checkUniqueNameChInter
							}]
						})(
							<Input/>
						)
					}
				</Form.Item>}
				{/* 基本信息-个人用户相关 */}
				{currentCustomer.customerType === 0 && <Form.Item
					{...formItemLayout}
					label="个人姓名"
				>
					{editable
						? getFieldDecorator("personalName", {
							initialValue: currentCustomer.personalName,
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
								max: 30,
								message: "必须为2~30个长度"
							}]
						})(
							<Input/>
						)
						: currentCustomer.personalName
					}
				</Form.Item>}
				{currentCustomer.customerType === 0 && editable && <Form.Item
					{...formItemLayout}
					label="个人身份证号"
				>
					{editable
						? getFieldDecorator("personalCard", {
							initialValue: currentCustomer.personalCard,
							rules: [{
								required: true,
								message: "必填"
							}]
						})(
							<Input/>
						)
						: currentCustomer.personalCard
					}
				</Form.Item>}
				{currentCustomer.customerType === 0 && editable && <div>
					<Form.Item
						{...formItemLayout}
						label="个人身份证扫描件"
					>
						<PictureView
							title="个人身份证正面扫描件"
							previewImage={personalCardAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>正面
							</span>
						</PictureView>
						{editable &&
								<Upload {...uploadPersonalCardAttatch}>
									<Button>
										<Icon type="upload"/> 更新
									</Button>
								</Upload>
						}
					</Form.Item>
					<Form.Item style={{display: "none"}}>
						{getFieldDecorator("personalCardAttatch", {
							initialValue: currentCustomer.personalCardAttatch
						})(<Input/>)}
					</Form.Item>
				</div>}
				{currentCustomer.customerType === 0 && editable && <div>
					<Form.Item
						{...formItemLayout}
						label="个人身份证扫描件"
					>
						<PictureView
							title="个人身份证背面扫描件"
							previewImage={personalCardBackAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>背面
							</span>
						</PictureView>
						<Upload {...uploadPersonalCardBackAttatch}>
							<Button>
								<Icon type="upload"/> 更新
							</Button>
						</Upload>
					</Form.Item>
					<Form.Item style={{display: "none"}}>
						{getFieldDecorator("personalCardBackAttatch", {
							initialValue: currentCustomer.personalCardAttatch
						})(<Input/>)}
					</Form.Item>
				</div>}
				{/* 显示身份证信息 */}
				{currentCustomer.customerType === 0 && !editable && <div>
					<Form.Item
						{...formItemLayout}
						label="个人身份证信息"
					>
						<span className={tabViewLess.mlr10}>{currentCustomer.personalCard}</span>
						<PictureView
							title="个人身份证正面扫描件"
							previewImage={personalCardAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>正面
							</span>
						</PictureView>
						<PictureView
							title="个人身份证背面扫描件"
							previewImage={personalCardBackAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>背面
							</span>
						</PictureView>
					</Form.Item>
				</div>}
				{/* 基本信息-企业用户相关 */}
				{currentCustomer.customerType === 1 && <Form.Item
					{...formItemLayout}
					label="公司名称"
				>
					{editable
						? getFieldDecorator("companyName", {
							initialValue: currentCustomer.companyName,
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
								min: 5,
								max: 50,
								message: "必须为5~50个长度"
							}]
						})(
							<Input/>
						)
						: currentCustomer.companyName
					}
				</Form.Item>}
				{currentCustomer.customerType === 1 && <Form.Item
					{...formItemLayout}
					label="法人姓名"
				>
					{editable
						? getFieldDecorator("corporateName", {
							initialValue: currentCustomer.corporateName,
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
								max: 30,
								message: "必须为2~30个长度"
							}]
						})(
							<Input/>
						)
						: currentCustomer.corporateName
					}
				</Form.Item>}
				{currentCustomer.customerType === 1 && <Form.Item
					{...formItemLayout}
					label="法人身份证号"
				>
					{editable
						? getFieldDecorator("corporateCard", {
							initialValue: currentCustomer.corporateCard,
							rules: [{
								required: true,
								message: "必填"
							}]
						})(
							<Input/>
						)
						: currentCustomer.corporateCard
					}
				</Form.Item>}
				{currentCustomer.customerType === 1 && <div>
					<Form.Item
						{...formItemLayout}
						label="法人身份证扫描件"
					>
						<PictureView
							title="法人身份证正面扫描件"
							previewImage={corporateCardAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>正面
							</span>
						</PictureView>
						{editable &&
							<Upload {...uploadCorporateCardAttatch}>
								<Button>
									<Icon type="upload"/> 更新
								</Button>
							</Upload>
						}
					</Form.Item>
					<Form.Item style={{display: "none"}}>
						{getFieldDecorator("corporateCardAttatch", {
							initialValue: currentCustomer.corporateCardAttatch
						})(<Input/>)}
					</Form.Item>
				</div>}
				{currentCustomer.customerType === 1 && <div>
					<Form.Item
						{...formItemLayout}
						label="法人身份证背面扫描件"
					>
						<PictureView
							title="法人身份证背面扫描件"
							previewImage={corporateCardBackAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>背面
							</span>
						</PictureView>
						{editable &&
							<Upload {...uploadCorporateCardBackAttatch}>
								<Button>
									<Icon type="upload"/> 更新
								</Button>
							</Upload>
						}
					</Form.Item>
					<Form.Item style={{display: "none"}}>
						{getFieldDecorator("corporateCardBackAttatch", {
							initialValue: currentCustomer.corporateCardBackAttatch
						})(<Input/>)}
					</Form.Item>
				</div>}
				{currentCustomer.customerType === 1 && <Form.Item
					{...formItemLayout}
					label="公司营业证件号"
				>
					{editable
						? getFieldDecorator("businessLicence", {
							initialValue: currentCustomer.businessLicence,
							rules: [{
								required: true,
								message: "必填"
							}]
						})(
							<Input/>
						)
						: currentCustomer.businessLicence
					}
				</Form.Item>}
				{currentCustomer.customerType === 1 && <div>
					<Form.Item
						{...formItemLayout}
						label="公司营业证件扫描件"
					>
						<PictureView
							title="公司营业证件扫描件"
							previewImage={businessLicenceAttatch}
						>
							<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
								<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>正面
							</span>
						</PictureView>
						{editable &&
							<Upload {...uploadBusinessLicenceAttatch}>
								<Button>
									<Icon type="upload"/> 更新
								</Button>
							</Upload>
						}
					</Form.Item>
					<Form.Item style={{display: "none"}}>
						{getFieldDecorator("businessLicenceAttatch", {
							initialValue: currentCustomer.businessLicenceAttatch
						})(<Input/>)}
					</Form.Item>
				</div>}
				<Form.Item
					{...formItemLayout}
					label="管理员手机号码"
				>
					{editable
						? getFieldDecorator("adminPhone", {
							initialValue: currentCustomer.adminPhone,
							rules: [{
								required: true,
								message: "必填"
							}, {
								pattern: patterns.mobile,
								message: "请输入合法的手机号码"
							}, {
								validator: checkUniqueAdminPhone
							}]
						})(
							<Input/>
						)
						: currentCustomer.adminPhone
					}
				</Form.Item>
				{/* 基本信息-公共部分 */}
				<Form.Item
					{...formItemLayout}
					label="退件地址"
				>
					{editable
						?	getFieldDecorator("returnAddress", {
							initialValue: {
								province: currentCustomer.returnProvince,
								city: currentCustomer.returnCity,
								district: currentCustomer.returnDistrict,
								streetAddress: currentCustomer.returnStreetAddress
							},
							rules: [{
								validator: checkReturnAddress
							}]
						})(
							<CascaderAddress options={districts}/>
						)
						: currentCustomer.returnAddress
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="注册地址"
				>
					{editable ?
						getFieldDecorator("registeredAddress", {
							initialValue: currentCustomer.registeredAddress,
							rules: [{
								pattern: patterns.address,
								message: "必须为地址"
							}, {
								pattern: patterns.notStartWithDigit,
								message: "首位不能为数字"
							}, {
								min: 2,
								max: 500,
								message: "必须为2~500个长度"
							}]
						})(
							<Input/>
						)
						: currentCustomer.registeredAddress
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="客户服务级别"
				>
					{editable
						? getFieldDecorator("customerServiceLevel", {
							initialValue: currentCustomer.customerServiceLevel,
							rules: [{
								required: true,
								message: "必填"
							}]
						})(
							<RadioGroup>
								<Radio value={0}>超V</Radio>
								<Radio value={1}>VIP</Radio>
								<Radio value={2}>黑名单</Radio>
							</RadioGroup>
						)
						: currentCustomer.customerServiceLevelName
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="平台来源"
				>
					{editable
						? getFieldDecorator("source", {
							initialValue: currentCustomer.source,
							rules: [{
								required: true,
								message: "必填"
							}]
						})(
							<RadioGroup
								onChange={handleSource}
							>
								{Array.from(PLATFORM_CONSTANTS).map(([key, value]) =>
									<RadioButton key={key} value={key}>{value}</RadioButton>
								)}
							</RadioGroup>
						)
						: PLATFORM_CONSTANTS.get(currentCustomer.source)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="介绍人"
				>
					{editable ?
						getFieldDecorator("introducer", {
							initialValue: (currentCustomer.introducer || "").toString(),
							rules: [{
								validator: checkIntroducerCodeInternal
							}]
						})(
							<AutoComplete
								allowClear
								placeholder="选择介绍人"
								onSearch={employeesAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={selectEmployee.employees.length > 0
									? selectEmployee.employees.map(item =>
										(<AOption key={item.id}>{item.name}</AOption>))
									: (currentCustomer.introducer && [(<AOption key={currentCustomer.introducer}>
										{currentCustomer.introducerName}</AOption>)])
								}
							/>
						)
						: currentCustomer.introducerName
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="创建时间"
				>
					<span>{currentCustomer.addTime}</span>
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="开户时间"
				>
					<span>{currentCustomer.signedTime}</span>
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="备注"
				>
					{editable ?
						getFieldDecorator("remark", {
							initialValue: currentCustomer.remark
						})(
							<TextArea rows={4}/>
						)
						: currentCustomer.remark
					}
				</Form.Item>
			</Row>
		</Form>
	)
}
const mapStateToProps =
	({customer, resource, loading, selectEmployee, administrativeDivision}) =>
		({customer, resource, loading, selectEmployee, administrativeDivision})
// 编辑头部-connect
const ConnectedCustomerHeader = connect(mapStateToProps)(CustomerHeader)
// 编辑主体-connect
const ConnectedCustomerBody =
	connect(mapStateToProps, null, null, {withRef: true})(Form.create()(CustomerBody))

// 编辑
class ViewModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	// tabs切换事件
	onChangeTabs = (tab) => {
		const {dispatch, payload: {customerCode}} = this.props
		dispatch({
			type: "customer/saveMainTab",
			payload: tab
		})
		if (tab === "sale") {
			dispatch({
				type: "customerContract/query",
				payload: {
					customerCode
				}
			})
			dispatch({
				type: "customerSales/query",
				payload: {
					customerCode
				}
			})
			dispatch({
				type: "customerReceiver/query",
				payload: {
					customerCode
				}
			})
		} else if (tab === "finance") {
			dispatch({
				type: "customerPayment/query",
				payload: {
					customerCode
				}
			})
			dispatch({
				type: "customerAffiliated/query",
				payload: {
					customerCode,
				}
			})
			dispatch({
				type: "customerSettle/query",
				payload: {
					customerCode,
				}
			})
			dispatch({
				type: "customerFinance/mainAccounts",
				payload: {
					customerCode,
				}
			})
		} else if (tab === "contact") {
			dispatch({
				type: "customerContact/query",
				payload: {
					customerCode
				}
			})
		} else if (tab === "consignor") {
			dispatch({
				type: "customerConsignor/query",
				payload: {
					customerCode
				}
			})
			dispatch({
				type: "customerConsignor/makeUnSelectable"
			})
		} else if (tab === "platform") {
			dispatch({
				type: "customerPlatform/query",
				payload: {
					customerCode
				}
			})
		} else if (tab === "blacklist") {
			dispatch({
				type: "customerBlacklist/query",
				payload: {
					customerCode
				}
			})
			dispatch({
				type: "selectRegion/selection",
				payload: {
					p: "1"
				}
			})
		} else if (tab === "customerLog") {
			dispatch({
				type: "customerLog/query",
				payload: {
					customerCode
				}
			})
		}
	}

	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		dispatch({
			type: "customer/view",
			payload: payload
		})
		dispatch({
			type: "administrativeDivision/initSelectDistricts"
		})
		if (e) e.stopPropagation()
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
		const {dispatch} = this.props
		dispatch({
			type: "customer/saveMainTab",
			payload: "baseInfo"
		})
		dispatch({
			type: "customer/makeUnEditable"
		})
		dispatch({
			type: "customerContact/makeUnEditable"
		})
		dispatch({
			type: "customerContact/makeUnCreatable"
		})
		dispatch({
			type: "customerConsignor/makeUnEditable"
		})
		dispatch({
			type: "customerConsignor/makeUnCreatable"
		})
	}
	okHandler = () => {
		const {onOk} = this.props
		const form = this.baseInfoForm.wrappedInstance
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				onOk(this.handleRetrunAddress(values))
				this.makeUnEditable()
			}
		})
	}
	handleRetrunAddress = values => (
		{...values,
			returnProvince: values.returnAddress.province,
			returnCity: values.returnAddress.city,
			returnDistrict: values.returnAddress.district,
			returnStreetAddress: values.returnAddress.streetAddress,
			returnAddress: undefined
		}
	)
	cancelHandler = () => {
		this.makeUnEditable()
	}
	makeEditableHandler = () => {
		const {dispatch} = this.props
		dispatch({
			type: "customer/makeEditable"
		})
	}
	makeUnEditable = () => {
		const {dispatch} = this.props
		dispatch({
			type: "customer/makeUnEditable"
		})
	}

	render() {
		// const {getFieldDecorator} = this.props.form
		const {children, title, location, editable, mainTab,
			customer, resource, currentTab} = this.props
		const {customerType} = customer.currentCustomer
		const reqProps = {location}
		let {viewLoading, updateLoading} = this.props
		if (viewLoading === undefined) {
			viewLoading = false
		}
		if (updateLoading === undefined) {
			updateLoading = false
		}

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
					visible={this.state.visible}
					footer={
						editable && mainTab ?
							<div>
								<Button onClick={this.okHandler} type="primary" size="large">保存</Button>
								<Button onClick={this.cancelHandler} size="large">取消</Button>
							</div>
							:
							<div>
								{elementAuth(location, "编辑客户", resource.currentResources) && mainTab && customerType !== undefined && <Button onClick={this.makeEditableHandler} type="primary" size="large">编辑</Button>}
								<Button onClick={this.hideModelHandler} size="large">关闭</Button>
							</div>
					}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.ViewModal)}
				>
					<Spin spinning={viewLoading || updateLoading}>
						{!viewLoading && !updateLoading &&
								<div>
									<ConnectedCustomerHeader
										location={location}
										resource={resource}
										mainTab={mainTab}
									/>
									<Tabs
										activeKey={currentTab}
										onChange={this.onChangeTabs}
										tabPosition="left"
										style={{marginBottom: "53px"}}
									>
										<TabPane tab="基本信息" key="baseInfo">
											<ConnectedCustomerBody ref={(child) => {
												this.baseInfoForm = child
											}}/>
										</TabPane>
										<TabPane tab="销售信息" key="sale">
											<SaleIndex {...reqProps}/>
										</TabPane>
										<TabPane tab="财务信息" key="finance">
											<FinanceIndex {...reqProps}/>
										</TabPane>
										<TabPane tab="联系人信息" key="contact">
											<ContactIndex {...reqProps}/>
										</TabPane>
										<TabPane tab="发货人信息" key="consignor">
											<ConsignorIndex {...reqProps}/>
										</TabPane>
										<TabPane tab="平台信息" key="platform">
											<PlatformIndex {...reqProps}/>
										</TabPane>
										<TabPane tab="操作日志" key="customerLog">
											<CustomerLogIndex {...reqProps}/>
										</TabPane>
									</Tabs>
								</div>
						}
					</Spin>
				</Modal>
			</span>
		)
	}
}
export default ViewModal
