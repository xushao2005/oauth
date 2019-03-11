import React from "react"
import {Col, Form, Icon, Input, Row} from "antd"
import {connect} from "dva"
import styles from "./view.less"
import CascaderAddress from "../../../components/data/cascaderAddress"
import {patterns} from "../../../utils/form"
import {checkCascaderAddress} from "../../../validators/cascaderAddress"

const ContactFormPage = ({dispatch, customer, administrativeDivision, form}) => {
	const {generateDistrictRaw: districts} = administrativeDivision
	const {getFieldDecorator} = form
	const {currentCustomer} = customer
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
	const openSave = () => {
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				dispatch({
					type: "customerContact/create",
					payload: {
						customerCode: currentCustomer.customerCode,
						...values
					}
				})
			}
		})
	}
	const closeNewForm = () => {
		dispatch({
			type: "customerContact/makeUnCreatable"
		})
	}
	const checkMobileOrTelephone = (rule, value, callback) => {
		if (!value) {
			callback()
		} else if (patterns.telephone.test(value) || patterns.mobile.test(value)) {
			callback()
		} else {
			callback("请输入正确的联系电话")
		}
	}
	const checkPickupAddress = (rule, value, callback) => {
		if (value && (!value.province || !value.streetAddress)) {
			callback("必填")
		} else {
			checkCascaderAddress(rule, value, callback)
		}
	}
	return (
		<div>
			<Form>
				<Row gutter={24}>
					<Col {...colLeftProps}/>
					<Col {...colRightProps} className={styles.operatorArea}>
						<div className={styles.operation}>
							<span className={styles.operationItem} onClick={openSave}>
								<Icon type="save"/>保存
							</span>
							<span className={styles.operationItem} onClick={closeNewForm}>
								<Icon type="close"/>取消
							</span>
						</div>
					</Col>
				</Row>
				<Form.Item
					{...formItemLayout}
					label="联系人"
				>
					{getFieldDecorator("contactName", {
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
					label="联系电话"
				>
					{getFieldDecorator("contactPhone", {
						rules: [{
							required: true,
							message: "必填"
						}, {
							validator: checkMobileOrTelephone
						}]
					})(<Input/>)}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="手机号码1"
				>
					{getFieldDecorator("contactPhone1", {
						rules: [{
							validator: checkMobileOrTelephone
						}]
					})(<Input/>)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="手机号码2"
				>
					{getFieldDecorator("contactPhone2", {
						rules: [{
							validator: checkMobileOrTelephone
						}]
					})(<Input/>)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="电子邮箱"
				>
					{getFieldDecorator("email", {
						rules: [{
							required: true,
							message: "必填"
						}, {
							type: "email",
							message: "请输入合法的电子邮箱"
						}]
					})(<Input/>)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="电子邮箱1"
				>
					{getFieldDecorator("email1", {
						rules: [{
							type: "email",
							message: "请输入合法的电子邮箱"
						}]
					})(<Input/>)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="取货地址"
				>
					{getFieldDecorator("pickupAddress", {
						initialValue: {},
						rules: [{
							required: true
						}, {
							validator: checkPickupAddress
						}]
					})(
						<CascaderAddress
							options={districts}/>)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="QQ号"
				>
					{getFieldDecorator("qq", {
						rules: [{
							type: "string",
							pattern: patterns.digit,
							message: "请输入正确的QQ号码"
						}]
					})(<Input/>)
					}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="旺旺号"
				>
					{getFieldDecorator("aliTalk", {
						rules: [{
							type: "string",
							pattern: patterns.english,
							message: "请输入正确的旺旺号"
						}]
					})(<Input/>)
					}
				</Form.Item>
			</Form>
		</div>
	)
}

const mapStateToProps = ({customer, administrativeDivision, resource, loading}) =>
	({customer, administrativeDivision, resource, loading})

export default connect(mapStateToProps)(Form.create()(ContactFormPage))
