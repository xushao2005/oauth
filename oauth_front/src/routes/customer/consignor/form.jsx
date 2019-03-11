import React, {Component} from "react"
import {Col, Form, Icon, Input, Radio, Popover, Row} from "antd"
import {connect} from "dva"
import lodash from "lodash"
import pinyin from "chinese-to-pinyin"
import styles from "./view.less"
import ProductFormItem from "./productFormItem"
import {patterns} from "../../../utils/form"
import * as customerConsignorService from "../../../services/customer/customerConsignor"
import {checkCascaderAddress} from "../../../validators/cascaderAddress"
import CascaderAddressI18n from "./cascaderAddressI18n"
import {GENDER_CONSTANTS} from "../../../constants/gender"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const {TextArea} = Input

class FormPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			productVisible: true
		}
	}
	openSave = () => {
		const {form, dispatch, customer} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				dispatch({
					type: "customerConsignor/create",
					payload: {
						customerCode: customer.currentCustomer.customerCode,
						...values
					}
				})
			}
		})
	}
	closeNewForm = () => {
		const {dispatch} = this.props
		dispatch({
			type: "customerConsignor/makeUnCreatable"
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
	checkProductCodes = async (rule, value, callback) => {
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
				const {customer} = this.props
				const params = {
					customerCode: customer.currentCustomer.customerCode
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
	checkAddress = (rule, value, callback) => {
		if (value && (!value.sprovince || !value.saddressCh)) {
			callback("必填")
		} else if (value && (!value.sprovince || !value.saddress)) {
			callback("必填，请自动转拼音")
		} else {
			callback()
		}
	}
	render() {
		const {getFieldDecorator} = this.props.form
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
		const defaultConsignor
			= this.props.customerConsignor.list.filter(consignor => consignor.default === true)
		const hasDefaultConsignor = defaultConsignor.length > 0
		return (
			<div>
				<Form>
					<Row gutter={24}>
						<Col {...colLeftProps}/>
						<Col {...colRightProps} className={styles.operatorArea}>
							<div className={styles.operation}>
								<span className={styles.operationItem} onClick={this.openSave}>
									<Icon type="save"/>保存
								</span>
								<span className={styles.operationItem} onClick={this.closeNewForm}>
									<Icon type="close"/>取消
								</span>
							</div>
						</Col>
					</Row>
					<Form.Item
						{...formItemLayout}
						label={<span><Popover content="自动生成拼音姓名">
							<Icon style={{color: "blue"}} type="copy" onClick={this.syncToSName}/>
						</Popover>&nbsp;发货人（中文）</span>}
					>
						{getFieldDecorator("snameCh", {
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
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="发货人（英文）"
					>
						{getFieldDecorator("sname", {
							rules: [{
								required: true,
								message: "必填"
							}, {
								type: "string",
								pattern: patterns.english,
								message: "请输入合法的字符"
							}, {
								type: "string",
								pattern: patterns.notStartWithDigit,
								message: "首字符不能为数字"
							}]
						})(<Input/>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="称呼"
					>
						{getFieldDecorator("gender", {
							rules: [{
								required: true,
								message: "必填"
							}]
						})(<RadioGroup>
							{Array.from(GENDER_CONSTANTS).map(([key, value]) =>
								(<RadioButton key={key} value={String(key)}>{value}</RadioButton>))}
						</RadioGroup>
						)
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司（中文）"
					>
						{getFieldDecorator("scompanyCh", {
							rules: [{
								type: "string",
								pattern: patterns.character,
								message: "请输入合法的字符"
							}, {
								type: "string",
								pattern: patterns.notStartWithDigit,
								message: "首字符不能为数字"
							}]
						})(<Input/>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="公司（英文）"
					>
						{getFieldDecorator("scompany", {
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
						})(<Input/>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="联系电话"
					>
						{getFieldDecorator("stel", {
							rules: [{
								required: true,
								message: "必填"
							}, {
								validator: this.checkMobileOrTelephone
							}]
						})(<Input/>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="传真"
					>
						{getFieldDecorator("sfax", {
							rules: [{
								validator: this.checkMobileOrTelephone
							}]
						})(<Input/>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="地址"
					>
						{getFieldDecorator("pickupAddress", {
							initialValue: {},
							rules: [{
								required: true,
								message: "必填"
							}, {
								validator: this.checkAddress
							}]
						})(
							<CascaderAddressI18n/>)}
					</Form.Item>
					{/* <Form.Item
						{...formItemLayout}
						label="地址2"
					>
						{getFieldDecorator("saddress2", {
						})(<Input/>)}
					</Form.Item> */}
					<Form.Item
						{...formItemLayout}
						label="邮政编码"
					>
						{getFieldDecorator("szip", {
							rules: [{
								required: true,
								message: "必填"
							}, {
								type: "string",
								max: 10,
								message: "非法邮编"
							}]
						})(<Input/>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="是否默认英文"
					>
						{getFieldDecorator("english", {
							initialValue: "true",
							rules: [{
								required: true,
								message: "必填"
							}]
						})(
							<RadioGroup>
								<Radio value="true">是</Radio>
								<Radio value="false">否</Radio>
							</RadioGroup>
						)
						}
					</Form.Item>
					{this.state.productVisible && hasDefaultConsignor && <Form.Item
						{...formItemLayout}
						label={<span>关联产品&nbsp;<Popover content="产品名称与产品名称之间请以顿号或换行符隔开">
							<Icon type="question-circle-o"/>
						</Popover></span>}
					>
						{getFieldDecorator("productNames", {
							rules: [{
								validator: this.checkProductCodes
							}]
						})(<ProductFormItem/>)}
					</Form.Item>}
					<Form.Item
						{...formItemLayout}
						label="默认发货人"
					>
						{getFieldDecorator("default", {
							initialValue: hasDefaultConsignor ? "false" : "true",
							rules: [{
								required: true
							}]
						})(<RadioGroup onChange={this.handleSetDefaultFlag} disabled={!hasDefaultConsignor}>
							<Radio value="true">是</Radio>
							<Radio value="false">否</Radio>
						</RadioGroup>)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="备注"
					>
						{getFieldDecorator("remark")(
							<TextArea rows={4}/>)
						}
					</Form.Item>
				</Form>
			</div>
		)
	}
}


const mapStateToProps = ({customer, resource, customerConsignor, loading, selectDistricts}) =>
	({customer, resource, customerConsignor, loading, selectDistricts})

export default connect(mapStateToProps)(Form.create()(FormPage))
