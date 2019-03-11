import React, {Component} from "react"
import {Row, Col, Form, Icon, Input, Popover, Radio, Tag, Popconfirm} from "antd"
import {connect} from "dva"
import lodash from "lodash"
import pinyin from "chinese-to-pinyin"
import styles from "./view.less"
import CascaderAddressI18n from "./cascaderAddressI18n"
import {patterns} from "../../../utils/form"
import ProductFormItem from "./productFormItem"
import * as customerConsignorService from "../../../services/customer/customerConsignor"
import {checkCascaderAddress} from "../../../validators/cascaderAddress"
import {elementAuth} from "../../../utils/auth"
import {findProvince, findProvincePinyin, findDistrict, findDistrictPinyin} from "../../../utils/districts"
import {GENDER_CONSTANTS} from "../../../constants/gender"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const {TextArea} = Input

class ViewPage extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	componentWillReceiveProps(nextProps) {
		const oldCurrentId = this.props.customerConsignor.currentId
		const newCurrentId = nextProps.customerConsignor.currentId
		if (newCurrentId !== oldCurrentId) {
			this.setState({productVisible: undefined})
		}
	}
	closeEditView = () => {
		const {dispatch} = this.props
		dispatch({
			type: "customerConsignor/makeUnEditable"
		})
	}
	openEditView = () => {
		const {dispatch} = this.props
		dispatch({
			type: "customerConsignor/makeEditable"
		})
	}
	openSave = () => {
		const {form, dispatch, customerConsignor} = this.props
		const {list, currentId} = customerConsignor
		const consignor = list.filter(item => item.id === currentId)[0]
		form.validateFields(["pickupAddress"], {force: true})
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				dispatch({
					type: "customerConsignor/update",
					payload: {
						id: consignor.id,
						customerCode: consignor.customerCode,
						...values
					}
				})
				dispatch({
					type: "customerConsignor/makeUnEditable"
				})
			}
		})
	}
	handleDelete = () => {
		const {dispatch, customerConsignor} = this.props
		const {list, currentId} = customerConsignor
		const consignor = list.filter(item => item.id === currentId)[0]
		dispatch({
			type: "customerConsignor/remove",
			payload: {
				id: consignor.id,
				customerCode: consignor.customerCode
			}
		})
	}
	checkMobileOrTelephone = (rule, value, callback) => {
		if (!value) {
			callback()
		} else if (patterns.telephone.test(value) || patterns.mobile.test(value)) {
			callback()
		} else {
			callback("请输入正确的联系电话或传真")
		}
	}
	checkPickupAddress = (rule, value, callback) => {
		if (value && (!value.province || !value.streetAddress)) {
			callback("必填")
		} else {
			checkCascaderAddress(rule, value, callback)
		}
	}
	checkAddress = (rule, value, callback) => {
		if (value && (!value.sprovince || !value.saddressCh)) {
			callback("必填")
		} else if (value && (!value.sprovince || !value.saddress)) {
			callback("必填，请自动转拼音")
		} else {
			callback()
		}
	}
	handleSetDefaultFlag = (e) => {
		if (e.target.value === "true") {
			this.setState({
				productVisible: false
			})
		} else {
			this.setState({
				productVisible: true
			})
		}
	}
	syncToSName = () => {
		const {getFieldsValue, setFieldsValue} = this.props.form
		const fields = getFieldsValue()
		const snameCh = fields.snameCh
		if (snameCh) {
			const sname = pinyin(snameCh, {noTone: true, filterChinese: true})
			fields.sname = lodash.upperFirst(lodash.camelCase(sname))
			setFieldsValue(fields)
		}
	}
	checkProductCodes = async (rule, value, callback) => {
		const {customerConsignor} = this.props
		const {list, currentId} = customerConsignor
		const consignor = list.filter(item => item.id === currentId)[0]
		if (!value || !value.value) {
			callback()
		} else {
			const separator = /、|\n|\r/
			const productNames = value.value.split(separator)
			const newSet = new Set()
			const duplicated = []
			for (const item of productNames) {
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
				const params = {
					id: consignor.id,
					customerCode: consignor.customerCode
				}
				for (let index = 0; index < productNames.length; index += 1) {
					params[`productNames[${index}]`] = productNames[index]
				}
				const {data} = await customerConsignorService.verify(params)
				const {notExisted, conflicted} = data
				if (notExisted) {
					callback(`您输入了不存在的产品：${notExisted.join("，")}`)
				} else if (conflicted) {
					callback(`下列产品已指定发货人：${conflicted.join("，")}`)
				} else {
					callback()
				}
			}
		}
	}
	handleSetDefault = () => {
		const {dispatch, customerConsignor} = this.props
		const {list, currentId} = customerConsignor
		const consignor = list.filter(item => item.id === currentId)[0]
		dispatch({
			type: "customerConsignor/setDefault",
			payload: {
				id: consignor.id,
				customerCode: consignor.customerCode
			}
		})
	}
	render() {
		const {location, resource, form, customerConsignor} = this.props
		const {currentId, list, editable, autoCompleteList, selectable} = customerConsignor
		const {getFieldDecorator} = form
		if (!currentId || (selectable && autoCompleteList.length === 0)) {
			return (<div/>)
		}
		let consignor = []
		if (selectable && autoCompleteList.length > 0) {
			consignor = autoCompleteList.filter(item => item.id === currentId)[0]
		} else {
			consignor = list.filter(item => item.id === currentId)[0]
		}
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
				margin: "16px auto"
			}
		}
		const colLeftProps = {
			xs: 24,
			sm: 5
		}
		const colRightProps = {
			xs: 24,
			sm: 19
		}
		const pickupAddress = (<span>
			{consignor.saddressCh && <Row>
				{findProvince(consignor.sprovince)}
				{findDistrict(consignor.sprovince, consignor.scity)}
				{consignor.sdistrict && findDistrict(consignor.scity, consignor.sdistrict)}
				{consignor.saddressCh}
			</Row>}
			{consignor.saddress && <Row>
				{consignor.saddress}&cedil;&nbsp;
				{consignor.sdistrict && `${findDistrictPinyin(consignor.scity, consignor.sdistrict)}`}&cedil;&nbsp;
				{findDistrictPinyin(consignor.sprovince, consignor.scity)}&cedil;&nbsp;
				{findProvincePinyin(consignor.sprovince)}
			</Row>}
		</span>)
		let productVisible = this.state.productVisible
		if (productVisible === undefined) {
			productVisible = !consignor.default
		}
		return (
			<div>
				<Form>
					<Row gutter={24}>
						<Col {...colLeftProps}>
							<Form.Item className={styles.consignorName}>
								{consignor.snameCh}
							</Form.Item>
						</Col>
						<Col {...colRightProps} className={styles.operatorArea}>
							<div className={styles.operation}>
								{editable
									? <span>
										<span className={styles.operationItem} onClick={this.openSave}>
											<Icon type="save"/>保存
										</span>
										<span className={styles.operationItem} onClick={this.closeEditView}>
											<Icon type="close"/>取消
										</span>
									</span>
									: (elementAuth(location, "编辑发货人", resource.currentResources) &&
										<span className={styles.operationItem} onClick={this.openEditView}>
											<Icon type="edit"/>编辑
										</span>)}
								{!consignor.default && !editable && elementAuth(location, "删除发货人", resource.currentResources) &&
								<Popconfirm title="确定删除？" onConfirm={this.handleDelete}>
									<span className={styles.operationItem}>
										<Icon type="delete"/>删除
									</span>
								</Popconfirm>}
								{/* 默认功能暂时取消 */}
								{false && !consignor.default && !editable && elementAuth(location, "设为默认发货人", resource.currentResources) &&
								<Popconfirm title="确定设为默认发货人？" onConfirm={this.handleSetDefault}>
									<span className={styles.operationItem}>
										<Icon type="delete"/>设为默认
									</span>
								</Popconfirm>}
								{false && consignor.default && "此记录为默认发货人"}
							</div>
						</Col>
					</Row>
					{editable && <Form.Item
						{...formItemLayout}
						label={<span><Popover content="自动生成拼音姓名">
							<Icon style={{color: "blue"}} type="copy" onClick={this.syncToSName}/>
						</Popover>&nbsp;发货人（中文）</span>}
					>
						{getFieldDecorator("snameCh", {
							initialValue: consignor.snameCh,
							rules: [{
								required: true,
								message: "必填"
							}, {
								type: "string",
								pattern: patterns.character,
								message: "请输入合法的字符"
							}, {
								type: "string",
								pattern: patterns.notStartWithDigit,
								message: "首字符不能为数字"
							}]
						})(<Input/>)}
					</Form.Item>}
					<Form.Item
						{...formItemLayout}
						label="发货人（英文）"
					>
						{editable
							? getFieldDecorator("sname", {
								initialValue: consignor.sname,
								rules: [{
									required: true,
									message: "必填"
								}, {
									type: "string",
									pattern: patterns.english,
									message: "请输入合法的英文字符"
								}, {
									type: "string",
									pattern: patterns.notStartWithDigit,
									message: "首字符不能为数字"
								}]
							})(<Input/>)
							: consignor.sname}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="称呼"
					>
						{editable
							? getFieldDecorator("gender", {
								initialValue: String(consignor.gender),
								rules: [{
									required: true,
									message: "必填"
								}]
							})(<RadioGroup>
								{Array.from(GENDER_CONSTANTS).map(([key, value]) =>
									(<RadioButton key={key} value={String(key)}>{value}</RadioButton>))}
							</RadioGroup>)
							: GENDER_CONSTANTS.get(consignor.gender)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司（中文）"
					>
						{editable
							? getFieldDecorator("scompanyCh", {
								initialValue: consignor.scompanyCh,
								rules: [{
									type: "string",
									pattern: patterns.character,
									message: "请输入合法的字符"
								}, {
									type: "string",
									pattern: patterns.notStartWithDigit,
									message: "首字符不能为数字"
								}]
							})(<Input/>)
							: consignor.scompanyCh}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司（英文）"
					>
						{editable
							? getFieldDecorator("scompany", {
								initialValue: consignor.scompany,
								rules: [{
									required: true,
									message: "必填"
								}, {
									type: "string",
									pattern: patterns.englishCompanyName,
									message: "请输入合法的字符"
								}, {
									type: "string",
									pattern: patterns.notStartWithDigit,
									message: "首字符不能为数字"
								}]
							})(<Input/>)
							: consignor.scompany}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="联系电话"
					>
						{editable
							? getFieldDecorator("stel", {
								initialValue: consignor.stel,
								rules: [{
									required: true,
									message: "必填"
								}, {
									validator: this.checkMobileOrTelephone
								}]
							})(<Input/>)
							: consignor.stel}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="地址"
					>
						{editable
							? getFieldDecorator("pickupAddress", {
								initialValue: {
									sprovince: consignor.sprovince,
									scity: consignor.scity,
									sdistrict: consignor.sdistrict,
									saddress: consignor.saddress,
									saddressCh: consignor.saddressCh
								},
								rules: [{
									required: true
								}, {
									validator: this.checkAddress
								}]
							})(
								<CascaderAddressI18n/>)
							: pickupAddress}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="邮政编码"
					>
						{editable
							? getFieldDecorator("szip", {
								initialValue: consignor.szip,
								rules: [{
									required: true,
									message: "必填"
								}, {
									type: "string",
									max: 10,
									message: "邮编非法"
								}]
							})(<Input/>)
							: consignor.szip}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="传真"
					>
						{editable
							? getFieldDecorator("sfax", {
								initialValue: consignor.sfax,
								rules: [{
									validator: this.checkMobileOrTelephone
								}]
							})(<Input/>)
							: consignor.sfax}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="是否默认英文"
					>
						{editable
							? getFieldDecorator("english", {
								initialValue: (consignor.english || "").toString(),
								rules: [{
									required: true,
									message: "必填"
								}]
							})(<RadioGroup onChange={this.handleEnglish}>
								<Radio value="true">是</Radio>
								<Radio value="false">否</Radio>
							</RadioGroup>)
							: (consignor.english ? "是" : "否")}
					</Form.Item>
					{productVisible && <Form.Item
						{...formItemLayout}
						label={<span>关联产品{editable && <span>&nbsp;<Popover content="产品名称与产品名称之间请以顿号或换行符隔开">
							<Icon type="question-circle-o"/>
						</Popover></span>}</span>}
					>
						{editable ? getFieldDecorator("productNames", {
							initialValue: {
								value: consignor.products.map(item => item.productname).join("、")
							},
							rules: [{
								validator: this.checkProductCodes
							}]
						})(<ProductFormItem/>)
							: consignor.products.map(item => (
								<Tag key={item.productcode}>{item.productname}</Tag>
							))}
					</Form.Item>}
					<Form.Item
						{...formItemLayout}
						label="默认发货人"
					>
						{editable
							? getFieldDecorator("default", {
								initialValue: String(consignor.default),
								rules: [{
									required: true
								}]
							})(<RadioGroup onChange={this.handleSetDefaultFlag} disabled={consignor.default}>
								<Radio value="true">是</Radio>
								<Radio value="false">否</Radio>
							</RadioGroup>)
							: (consignor.default ? "是" : "否")}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="备注"
					>
						{editable
							? getFieldDecorator("remark")(
								<TextArea rows={4}/>)
							: (consignor.remark)
						}
					</Form.Item>
				</Form>
			</div>
		)
	}
}

const mapStateToProps = ({customerConsignor, resource, loading}) =>
	({customerConsignor, resource, loading})

export default connect(mapStateToProps)(Form.create()(ViewPage))
