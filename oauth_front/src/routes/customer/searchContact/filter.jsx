import React from "react"
import {Button, Col, Form, Input, Row, notification, Cascader, Icon, Popover} from "antd"
import {handleReset, hasValues, patterns} from "../../../utils/form"

const FilterContent = ({filter, form, onFilterChange, selectDistricts}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const {districts} = selectDistricts
	const colProps = {
		xs: 24,
		sm: 8
	}
	const formItemLayout = {
		labelCol: {
			xs: 24,
			sm: 9
		},
		wrapperCol: {
			xs: 24,
			sm: 15
		},
		style: {
			marginBottom: 16
		}
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const handleFields = (values) => {
		const changeValues = {}
		for (const it in values) {
			if (it === "addresses" && values[it] && values[it].length > 0) {
				changeValues.returnProvince = values.addresses[0]
				changeValues.returnCity = values.addresses[1]
				changeValues.returnDistrict = values.addresses[2]
			} else {
				changeValues[it] = values[it]
			}
		}
		return changeValues
	}
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!hasValues(form)) {
				notification.warn({
					message: "必须至少指定一个搜索条件"
				})
			}
			if (!err) {
				const fields = getFieldsValue()
				onFilterChange(handleFields(fields))
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

	const addresses = {}
	const handleCascaderChange = (cascader) => {
		addresses.province = cascader[0]
		addresses.city = cascader[1]
		addresses.district = cascader[2]
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="联系人"
					>
						{getFieldDecorator("contactName", {
							initialValue: filter.contactName,
							rules: [{
								type: "string",
								pattern: patterns.character,
								message: "请输入正确的联系人"
							}, {
								type: "string",
								pattern: patterns.notStartWithDigit,
								message: "首位不能为数字"
							}]
						})(
							<Input placeholder="请输入联系人"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="联系电话"
					>
						{getFieldDecorator("contactPhone", {
							initialValue: filter.contactPhone,
							rules: [{
								validator: checkMobileOrTelephone
							}]
						})(
							<Input placeholder="请输入联系电话"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="电子邮箱"
					>
						{getFieldDecorator("email", {
							initialValue: filter.email,
							rules: [{
								type: "email",
								message: "请输入正确的电子邮箱"
							}]
						})(
							<Input placeholder="请输入电子邮箱"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="省/市/区"
					>
						{getFieldDecorator("addresses")(
							<Cascader
								allowClear
								showSearch
								options={districts}
								onChange={handleCascaderChange}
								placeholder="选择省市区"
							/>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="街道地址"
					>
						{getFieldDecorator("returnStreetAddress")(
							<Input placeholder="请输入街道地址"/>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} offset={1} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" style={{marginLeft: 8, marginRight: 8}} onClick={handleFilterReset}>重置</Button>
					<Popover content="取货地址包含省/市/区和街道地址">
						<Icon type="question-circle-o"/>
					</Popover>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
