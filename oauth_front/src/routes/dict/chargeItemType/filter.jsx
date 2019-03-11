import React from "react"
import {Button, Col, Form, Input, Row, Select} from "antd"
import {handleReset, patterns} from "../../../utils/form"
import billType from "../../../constants/billType"
import chargeType from "../../../constants/chargeType"

const Option = Select.Option
const FilterContent = ({filter, form, onFilterChange}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
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
	const colProps = {
		xs: 24,
		sm: 8
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				onFilterChange(fields)
			}
		})
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="计费项类型编号"
					>
						{getFieldDecorator("code", {
							initialValue: filter.code,
							rules: [{
								pattern: patterns.digit,
								message: "请输入正确的编号"
							}]
						})(
							<Input/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="计费项类型名称"
					>
						{getFieldDecorator("name", {
							initialValue: filter.name
						})(
							<Input/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="单号类型"
					>
						{getFieldDecorator("billType", {
							initialValue: filter.billType
						})(
							<Select allowClear>
								{Array.from(billType)
									.map(([key, value]) =>
										(<Option key={key}>{value}</Option>))}
							</Select>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="费用类型"
					>
						{getFieldDecorator("type", {
							initialValue: filter.type
						})(
							<Select allowClear>
								{Array.from(chargeType)
									.map(([key, value]) =>
										(<Option key={key}>{value}</Option>))}
							</Select>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} offset={1} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
