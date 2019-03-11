import React from "react"
import {Row, Col, Form, Icon, Input, Popconfirm} from "antd"
import {connect} from "dva"
import styles from "./view.less"
import CascaderAddress from "../../../components/data/cascaderAddress"
import {patterns} from "../../../utils/form"
import {checkCascaderAddress} from "../../../validators/cascaderAddress"
import {elementAuth} from "../../../utils/auth"

const ContactIndexPage = ({location, dispatch, customerContact,
	administrativeDivision, form, resource}) => {
	const {currentId, list, editable} = customerContact
	const {generateDistrictRaw: districts} = administrativeDivision
	const {getFieldDecorator} = form
	if (!currentId) {
		return (<div/>)
	}
	const contact = list.filter(item => item.id === currentId)[0]
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
	const closeEditView = () => {
		dispatch({
			type: "customerContact/makeUnEditable"
		})
	}
	const openEditView = () => {
		dispatch({
			type: "customerContact/makeEditable"
		})
	}
	const openSave = () => {
		// 验证是否存在完整地址
		form.validateFields(["pickupAddress"], {force: true})
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				dispatch({
					type: "customerContact/update",
					payload: {
						id: contact.id,
						customerCode: contact.customerCode,
						...values
					}
				})
				dispatch({
					type: "customerContact/makeUnEditable"
				})
			}
		})
	}
	const handleDelete = () => {
		dispatch({
			type: "customerContact/remove",
			payload: {
				id: contact.id,
				customerCode: contact.customerCode
			}
		})
	}
	const handleSetDefault = () => {
		dispatch({
			type: "customerContact/setDefault",
			payload: {
				id: contact.id,
				customerCode: contact.customerCode
			}
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
					<Col {...colLeftProps}>
						<Form.Item className={styles.contactName}>
							{contact.contactName}
						</Form.Item>
					</Col>
					<Col {...colRightProps} className={styles.operatorArea}>
						<div className={styles.operation}>
							{editable
								? <span>
									<span className={styles.operationItem} onClick={openSave}>
										<Icon type="save"/>保存
									</span>
									<span className={styles.operationItem} onClick={closeEditView}>
										<Icon type="close"/>取消
									</span>
								</span>
								: (elementAuth(location, "编辑联系人", resource.currentResources) && <span className={styles.operationItem} onClick={openEditView}>
									<Icon type="edit"/>编辑
								</span>)}
							{!contact.defaultContact && !editable && elementAuth(location, "删除联系人", resource.currentResources) &&
								<Popconfirm title="确定删除？" onConfirm={handleDelete}>
									<span className={styles.operationItem}>
										<Icon type="delete"/>删除
									</span>
								</Popconfirm>}
							{!contact.defaultContact && !editable && elementAuth(location, "设置默认联系人", resource.currentResources) &&
							<Popconfirm title="确定设为默认联系人？" onConfirm={handleSetDefault}>
								<span className={styles.operationItem}>
									<Icon type="setting"/>设为默认
								</span>
							</Popconfirm>}
							{contact.defaultContact && "此记录为默认联系人"}
						</div>
					</Col>
				</Row>
				{editable && <Form.Item
					{...formItemLayout}
					label="联系人"
				>
					{getFieldDecorator("contactName", {
						initialValue: contact.contactName,
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
					label="联系电话"
				>
					{editable
						? getFieldDecorator("contactPhone", {
							initialValue: contact.contactPhone,
							rules: [{
								required: true,
								message: "必填"
							}, {
								validator: checkMobileOrTelephone
							}]
						})(<Input/>)
						: contact.contactPhone}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="手机号码1"
				>
					{editable
						? getFieldDecorator("contactPhone1", {
							initialValue: contact.contactPhone1,
							rules: [{
								validator: checkMobileOrTelephone
							}]
						})(<Input/>)
						: contact.contactPhone1}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="手机号码2"
				>
					{editable
						? getFieldDecorator("contactPhone2", {
							initialValue: contact.contactPhone2,
							rules: [{
								validator: checkMobileOrTelephone
							}]
						})(<Input/>)
						: contact.contactPhone2}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="电子邮箱"
				>
					{editable
						? getFieldDecorator("email", {
							initialValue: contact.email,
							rules: [{
								required: true,
								message: "必填"
							}, {
								type: "email",
								message: "请输入合法的电子邮箱"
							}]
						})(<Input/>)
						: contact.email}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="电子邮箱1"
				>
					{editable
						? getFieldDecorator("email1", {
							initialValue: contact.email1,
							rules: [{
								type: "email",
								message: "请输入合法的电子邮箱"
							}]
						})(<Input/>)
						: contact.email1}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="取货地址"
				>
					{editable
						? getFieldDecorator("pickupAddress", {
							initialValue: {
								province: contact.province,
								city: contact.city,
								district: contact.district,
								streetAddress: contact.streetAddress
							},
							rules: [{
								required: true
							}, {
								validator: checkPickupAddress
							}]
						})(
							<CascaderAddress
								options={districts}/>)
						: contact.pickupAddress}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="QQ号"
				>
					{editable
						? getFieldDecorator("qq", {
							initialValue: contact.qq,
							rules: [{
								type: "string",
								pattern: patterns.digit,
								message: "请输入正确的QQ号码"
							}]
						})(<Input/>)
						: contact.qq}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label="旺旺号"
				>
					{editable
						? getFieldDecorator("aliTalk", {
							initialValue: contact.aliTalk,
							rules: [{
								type: "string",
								pattern: patterns.english,
								message: "请输入正确的旺旺号"
							}]
						})(<Input/>)
						: contact.aliTalk}
				</Form.Item>
			</Form>
		</div>
	)
}

const mapStateToProps = ({customerContact, administrativeDivision, resource, loading}) =>
	({customerContact, administrativeDivision, resource, loading})

export default connect(mapStateToProps)(Form.create()(ContactIndexPage))
