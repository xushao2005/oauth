import React from "react"
import {Button, Col, Form, Input, Row, Select} from "antd"
import {handleReset} from "../../../utils/form"

const Item = Form.Item
const Option = Select.Option
const FilterContent = ({form, filter, platforms, onFilterChange}) => {
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
	const {getFieldDecorator, getFieldsValue, validateFieldsAndScroll} = form
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
					<Item
						{...formItemLayout}
						label="客户平台号"
					>
						{getFieldDecorator("transportCustomerCode", {
							initialValue: filter.transportCustomerCode
						})(
							<Input placeholder="客户平台号"/>
						)}
					</Item>
				</Col>
				<Col {...colProps}>
					<Item
						{...formItemLayout}
						label="客户姓名"
					>
						{getFieldDecorator("name", {
							initialValue: filter.name
						})(
							<Input placeholder="客户姓名"/>
						)}
					</Item>
				</Col>
				<Col {...colProps}>
					<Item
						{...formItemLayout}
						label="联系号码"
					>
						{getFieldDecorator("phone", {
							initialValue: filter.phone
						})(
							<Input placeholder="联系号码"/>
						)}
					</Item>
				</Col>
				<Col {...colProps}>
					<Item
						{...formItemLayout}
						label="来源平台"
					>
						{getFieldDecorator("sourceId", {
							initialValue: filter.sourceId
						})(<Select allowClear placeholder="全部">
							{platforms.map(item =>
								<Option key={item.code} value={String(item.code)}>{item.name}</Option>)
							}
						</Select>)}
					</Item>
				</Col>
				<Col {...colProps}>
					<Item
						{...formItemLayout}
						label="通知状态"
					>
						{getFieldDecorator("associateFlag", {
							initialValue: filter.associateFlag
						})(
							<Select
								allowClear
								placeholder="未通知">
								<Option value="0">未通知</Option>
								<Option value="1">已通知</Option>
							</Select>
						)}
					</Item>
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
