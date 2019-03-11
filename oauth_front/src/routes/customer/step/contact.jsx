import React from "react"
import {Form, Input} from "antd"
import {connect} from "dva"
import CascaderAddress from "../../../components/data/cascaderAddress"
import {checkCascaderAddress} from "../../../validators/cascaderAddress"
import {patterns} from "../../../utils/form"

const ContactForm = ({customer, selectDistricts, form}) => {
	const {getFieldDecorator} = form
	const {cacheCustomer} = customer
	const {districts} = selectDistricts
	const contact = cacheCustomer.contact ? cacheCustomer.contact : {}
	let pickupAddress
	if (contact.pickupAddress) {
		pickupAddress = contact.pickupAddress
	} else if (cacheCustomer.returnAddress) {
		pickupAddress = cacheCustomer.returnAddress
	} else {
		pickupAddress = {}
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
	const checkPickupAddress = (rule, value, callback) => {
		if (value && (!value.province || !value.streetAddress)) {
			callback("必填")
		} else {
			checkCascaderAddress(rule, value, callback)
		}
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
	return (
		<Form>
			<Form.Item
				{...formItemLayout}
				label="客户号"
			>
				{getFieldDecorator("customerCode", {
					initialValue: cacheCustomer.customerCode
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
					initialValue: cacheCustomer.customerName
				})(
					<Input disabled/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="联系人"
			>
				{getFieldDecorator("contactName", {
					initialValue: contact.contactName || cacheCustomer.customerName,
					rules: [{
						required: true,
						message: "必填"
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="取货地址"
			>
				{getFieldDecorator("pickupAddress", {
					initialValue: {
						province: pickupAddress.province,
						city: pickupAddress.city,
						district: pickupAddress.district,
						streetAddress: pickupAddress.streetAddress
					},
					rules: [{
						required: true
					}, {
						validator: checkPickupAddress
					}]
				})(
					<CascaderAddress
						options={districts}/>)}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="联系电话"
			>
				{getFieldDecorator("contactPhone", {
					initialValue: cacheCustomer.contactPhone,
					rules: [{
						required: true,
						message: "必填"
					}, {
						validator: checkMobileOrTelephone
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="联系电话1"
			>
				{getFieldDecorator("contactPhone1", {
					initialValue: cacheCustomer.contactPhone1,
					rules: [{
						validator: checkMobileOrTelephone
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="联系电话2"
			>
				{getFieldDecorator("contactPhone2", {
					initialValue: cacheCustomer.contactPhone2,
					rules: [{
						validator: checkMobileOrTelephone
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="电子邮箱"
			>
				{getFieldDecorator("email", {
					initialValue: cacheCustomer.email,
					rules: [{
						required: true,
						message: "必填"
					}, {
						type: "email",
						message: "请输入合法的电子邮箱"
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="电子邮箱1"
			>
				{getFieldDecorator("email1", {
					initialValue: cacheCustomer.email1,
					rules: [{
						type: "email",
						message: "请输入合法的电子邮箱"
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="QQ号"
			>
				{getFieldDecorator("qq", {
					initialValue: cacheCustomer.qq,
					rules: [{
						type: "string",
						pattern: patterns.digit,
						message: "请输入正确的QQ号码"
					}]
				})(
					<Input/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="旺旺号"
			>
				{getFieldDecorator("aliTalk", {
					initialValue: cacheCustomer.aliTalk,
					rules: [{
						type: "string",
						pattern: patterns.english,
						message: "请输入正确的旺旺号"
					}]
				})(
					<Input/>
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
					<Input/>
				)
				}
			</Form.Item>
		</Form>
	)
}

const mapStateToProps = ({customer, selectDistricts, loading}) =>
	({customer, selectDistricts, loading})

export default connect(mapStateToProps, null, null,
	{withRef: true})(Form.create()(ContactForm))
