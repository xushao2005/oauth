import React from "react"
import {AutoComplete, Button, Form, Icon, Input, notification, Popover, Radio, Upload} from "antd"
import {connect} from "dva"
import CascaderAddress from "../../../components/data/cascaderAddress"
import {styles} from "../../../components/layouts"
import {checkCascaderAddress} from "../../../validators/cascaderAddress"
import PictureView from "../../../components/data/pictureView"
import {fileApi} from "../../../constants/api"
import {patterns} from "../../../utils/form"
import {checkUniqueNameCh, checkIntroducerCode, checkCheckingCode} from "../../../validators/customer/customer"
import PLATFORM_CONSTANTS from "../../../constants/platform"
import {PAY_CYCLE_CONSTANTS} from "../../../constants/payCycle"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const AOption = AutoComplete.Option
const {TextArea} = Input

const CustomerForm = ({dispatch, customer, selectEmployee, administrativeDivision, form}) => {
	const {getFieldDecorator, getFieldsValue, setFieldsValue} = form
	const {generateDistrictRaw: districts} = administrativeDivision
	const {cacheCustomer} = customer
	const fileds = getFieldsValue()
	let returnAddress
	if (cacheCustomer.returnAddress) {
		returnAddress = cacheCustomer.returnAddress
	} else {
		returnAddress = {}
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
	const checkReturnAddress = (rule, value, callback) => {
		checkCascaderAddress(rule, value, callback)
	}
	const checksAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/checksAutoComplete",
			payload: {
				q: value
			}
		})
	}
	const employeesAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/employeesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	// 验证相关
	const checkUniqueNameChInter = (rule, value, callback) => {
		const {code} = cacheCustomer
		const values = {
			code: code,
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
	// 检验 对账客服存在
	const checkCheckingCodeInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkCheckingCode(rule, values, callback)
	}
	// 上传图片
	let personalCardAttatch // 个人正面
	let personalCardBackAttatch // 个人背面
	if (fileds.personalCardAttatch) {
		personalCardAttatch = fileds.personalCardAttatch
	}
	if (fileds.personalCardBackAttatch) {
		personalCardBackAttatch = fileds.personalCardBackAttatch
	}
	let corporateCardAttatch // 法人正面
	let corporateCardBackAttatch // 法人背面
	let businessLicenceAttatch // 公司营业证件
	if (fileds.corporateCardAttatch) {
		corporateCardAttatch = fileds.corporateCardAttatch
	}
	if (fileds.corporateCardBackAttatch) {
		corporateCardBackAttatch = fileds.corporateCardBackAttatch
	}
	if (fileds.businessLicenceAttatch) {
		businessLicenceAttatch = fileds.businessLicenceAttatch
	}
	const cacheCostomerAttach = () => {
		const fields = getFieldsValue()
		dispatch({
			type: "customer/saveCacheCustomer",
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
					cacheCostomerAttach()
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
					cacheCostomerAttach()
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
					cacheCostomerAttach()
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
					cacheCostomerAttach()
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
					cacheCostomerAttach()
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
	const syncToRegisteredAddress = () => {
		const fields = getFieldsValue()
		const data = fields.returnAddress
		fields.registeredAddress = `${data.province || ""}${data.city || ""}${data.district || ""}${data.streetAddress || ""}`
		setFieldsValue(fields)
	}

	const checkUniqueAdminPhone = (rule, value, callback) => {
		dispatch({
			type: "customer/adminPhoneExists",
			payload: {
				adminPhone: value
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

	return (
		<Form>
			<div className={styles.formGroupTitle}>基本信息</div>
			<Form.Item
				{...formItemLayout}
				label="客户号"
			>
				{getFieldDecorator("customerCode", {
					initialValue: cacheCustomer.customerCode,
					rules: [{
						required: true,
						message: "必填"
					}]
				})(
					<Input disabled/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="客户名称"
			>
				{getFieldDecorator("customerName", {
					initialValue: cacheCustomer.customerName,
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
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="客户服务级别"
			>
				{getFieldDecorator("customerServiceLevel", {
					initialValue: cacheCustomer.customerServiceLevel || 1,
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
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="平台来源"
			>
				{getFieldDecorator("source", {
					rules: [{
						required: true,
						message: "必填"
					}]
				})(
					<RadioGroup>
						{Array.from(PLATFORM_CONSTANTS).map(([key, value]) =>
							<RadioButton key={key} value={key}>{value}</RadioButton>
						)}
					</RadioGroup>
				)
				}
			</Form.Item>
			{/* 基本信息-个人用户相关 */}
			{cacheCustomer.customerType === 0 && <div>
				<Form.Item
					{...formItemLayout}
					label="个人姓名"
				>
					{getFieldDecorator("personalName", {
						initialValue: cacheCustomer.personalName,
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
					}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 0 && <div>
				<Form.Item
					{...formItemLayout}
					label="个人身份证号"
				>
					{getFieldDecorator("personalCard", {
						initialValue: cacheCustomer.personalCard,
						rules: [{
							required: true,
							message: "必填"
						}]
					})(
						<Input/>
					)
					}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 0 && <div>
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
					<Upload {...uploadPersonalCardAttatch}>
						<Button>
							<Icon type="upload"/> 上传
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item style={{display: "none"}}>
					{getFieldDecorator("personalCardAttatch", {
						initialValue: cacheCustomer.personalCardAttatch
					})(<Input/>)}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 0 && <div>
				<Form.Item
					{...formItemLayout}
					label="个人身份证背面扫描件"
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
							<Icon type="upload"/> 上传
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item style={{display: "none"}}>
					{getFieldDecorator("personalCardBackAttatch", {
						initialValue: cacheCustomer.personalCardBackAttatch
					})(<Input/>)}
				</Form.Item>
			</div>}
			{/* 基本信息-企业用户相关 */}
			{cacheCustomer.customerType === 1 && <div>
				<Form.Item
					{...formItemLayout}
					label="公司名称"
				>
					{getFieldDecorator("companyName", {
						initialValue: cacheCustomer.companyName,
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
					}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 1 && <div>
				<Form.Item
					{...formItemLayout}
					label="法人姓名"
				>
					{getFieldDecorator("corporateName", {
						initialValue: cacheCustomer.corporateName,
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
					}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 1 && <div>
				<Form.Item
					{...formItemLayout}
					label="法人身份证号"
				>
					{getFieldDecorator("corporateCard", {
						initialValue: cacheCustomer.corporateCard,
						rules: [{
							required: true,
							message: "必填"
						}]
					})(
						<Input/>
					)
					}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 1 && <div>
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
					<Upload {...uploadCorporateCardAttatch}>
						<Button>
							<Icon type="upload"/> 上传
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item style={{display: "none"}}>
					{getFieldDecorator("corporateCardAttatch", {
						initialValue: cacheCustomer.corporateCardAttatch
					})(<Input/>)}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 1 && <div>
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
					<Upload {...uploadCorporateCardBackAttatch}>
						<Button>
							<Icon type="upload"/> 上传
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item style={{display: "none"}}>
					{getFieldDecorator("corporateCardBackAttatch", {
						initialValue: cacheCustomer.corporateCardBackAttatch
					})(<Input/>)}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 1 && <div>
				<Form.Item
					{...formItemLayout}
					label="公司营业证件号"
				>
					{getFieldDecorator("businessLicence", {
						initialValue: cacheCustomer.businessLicence,
						rules: [{
							required: true,
							message: "必填"
						}]
					})(<Input/>)}
				</Form.Item>
			</div>}
			{cacheCustomer.customerType === 1 && <div>
				<Form.Item
					{...formItemLayout}
					label="公司营业证件扫描件"
				>
					<PictureView
						title="公司营业证件扫描件"
						previewImage={businessLicenceAttatch}
					>
						<span style={{margin: "0 10px", color: "#49a9ee", cursor: "pointer"}}>
							<Icon title="查看" type="eye-o" style={{marginRight: "2px"}}/>营业证
						</span>
					</PictureView>
					<Upload {...uploadBusinessLicenceAttatch}>
						<Button>
							<Icon type="upload"/> 上传
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item style={{display: "none"}}>
					{getFieldDecorator("businessLicenceAttatch", {
						initialValue: cacheCustomer.businessLicenceAttatch
					})(<Input/>)}
				</Form.Item>
			</div>}
			{/* 基本信息-公共部分 */}
			<Form.Item
				{...formItemLayout}
				label="管理员手机号码"
			>
				{getFieldDecorator("adminPhone", {
					initialValue: cacheCustomer.adminPhone,
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
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label={<span><Popover content="点击即可同步到下面的注册地址">
					<Icon style={{color: "blue"}} type="copy" onClick={syncToRegisteredAddress}/>
				</Popover>&nbsp;退件地址</span>}
			>
				{getFieldDecorator("returnAddress", {
					initialValue: {
						province: returnAddress.province,
						city: returnAddress.city,
						district: returnAddress.district,
						streetAddress: returnAddress.streetAddress
					},
					rules: [{
						validator: checkReturnAddress
					}]
				})(
					<CascaderAddress
						options={districts}/>)}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="注册地址"
			>
				{getFieldDecorator("registeredAddress", {
					initialValue: cacheCustomer.registeredAddress,
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
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="介绍人"
			>
				{getFieldDecorator("introducer", {
					initialValue: cacheCustomer.introducer,
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
						dataSource={selectEmployee.employees.map(item =>
							(<AOption key={item.id}>{item.name}</AOption>)
						)}
					/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="备注"
			>
				{getFieldDecorator("remark", {
					initialValue: cacheCustomer.remark
				})(
					<TextArea rows={4}/>
				)
				}
			</Form.Item>
			<div className={styles.formGroupTitle}>财务信息</div>
			<Form.Item
				{...formItemLayout}
				label="客户信用等级"
			>
				{getFieldDecorator("creditLevel", {
					initialValue: cacheCustomer.creditLevel
					|| "A".charCodeAt(),
					rules: [{
						required: true,
						message: "必填"
					}]
				})(
					<RadioGroup>
						<RadioButton value={"A".charCodeAt()}>A</RadioButton>
						<RadioButton value={"B".charCodeAt()}>B</RadioButton>
						<RadioButton value={"C".charCodeAt()}>C</RadioButton>
						<RadioButton value={"D".charCodeAt()}>D</RadioButton>
					</RadioGroup>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="客户信用额度"
			>
				{getFieldDecorator("creditLimit", {
					initialValue: cacheCustomer.creditLimit || "0",
					rules: [{
						required: true,
						message: "必填"
					}, {
						pattern: "^\\d{0,5}$|^100000$",
						message: "必须为0～100000的数字"
					}]
				})(
					<Input placeholder="必须为0～100000的数字"/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="付款周期"
			>
				{getFieldDecorator("payCycle", {
					initialValue: cacheCustomer.payCycle || 1,
					rules: [{
						required: true,
						message: "必填"
					}]
				})(<RadioGroup>
					{Array.from(PAY_CYCLE_CONSTANTS).map(([key, value]) =>
						(<RadioButton key={key} value={key}>{value}</RadioButton>))}
				</RadioGroup>)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="对账客服"
			>
				{getFieldDecorator("reconciliationClerk", {
					initialValue: cacheCustomer.reconciliationClerk,
					rules: [{
						required: true,
						message: "必填"
					}, {
						validator: checkCheckingCodeInternal
					}]
				})(
					<AutoComplete
						allowClear
						placeholder="选择对账客服"
						onSearch={checksAutoComplete}
						dropdownMatchSelectWidth={false}
						dropdownStyle={{minWidth: 150}}
						dataSource={selectEmployee.checks.map(item =>
							(<AOption key={item.id}>{item.name}</AOption>)
						)}
					/>
				)
				}
			</Form.Item>
		</Form>
	)
}

const mapStateToProps = ({customer, selectEmployee, administrativeDivision, loading}) =>
	({customer, selectEmployee, administrativeDivision, loading})

export default connect(mapStateToProps, null, null,
	{withRef: true})(Form.create()(CustomerForm))
