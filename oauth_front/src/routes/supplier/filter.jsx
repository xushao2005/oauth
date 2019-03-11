import React from "react"
import {AutoComplete, Button, Col, DatePicker, Form, Input, Row, Select} from "antd"
import moment from "moment"
import {handleReset} from "../../utils/form"

const AOption = AutoComplete.Option
const {RangePicker} = DatePicker
const Option = Select.Option

const dateFormat = "YYYY-MM-DD HH:mm:ss"
const FilterContent = ({dispatch, filter, form, selectSupplier, onFilterChange}) => {
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
	const dateFormItemLayout = {
		labelCol: {
			xs: 24,
			sm: 5
		},
		wrapperCol: {
			xs: 24,
			sm: 19
		},
		style: {
			marginBottom: 16
		}
	}
	const colMiddleProps = {
		xs: 24,
		sm: 12,
	}
	const supplierAutoComplete = (value) => {
		dispatch({
			type: "selectSupplier/selection",
			payload: {
				q: value
			}
		})
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const handleFields = (fields) => {
		const {createTime} = fields
		if (createTime.length) {
			fields.createTime = [
				createTime[0].format(dateFormat),
				createTime[1].format(dateFormat)
			]
		}
		return fields
	}
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				handleFields(fields)
				onFilterChange(fields)
			}
		})
	}
	const initialTimeRange = []
	if (filter.createTime && filter.createTime[0]) {
		initialTimeRange[0] = moment(filter.createTime[0])
	}
	if (filter.createTime && filter.createTime[1]) {
		initialTimeRange[1] = moment(filter.createTime[1])
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="供应商编码"
					>
						{getFieldDecorator("code", {
							initialValue: filter.code
						})(
							<Input placeholder="请输入供应商编码"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="供应商中文名称"
					>
						{getFieldDecorator("nameCh", {
							initialValue: filter.nameCh
						})(
							<AutoComplete
								allowClear
								placeholder="请输入供应商中文名称"
								onSearch={supplierAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{width: 150}}
								dataSource={selectSupplier.suppliers.map(item =>
									(<AOption key={item.nameCh}>{item.nameCh}</AOption>)
								)}
							/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否启用"
					>
						{getFieldDecorator("enable", {
							initialValue: filter.enable
						})(
							<Select
								allowClear>
								<Option value="1">是</Option>
								<Option value="0">否</Option>
							</Select>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="供应商曾用名"
					>
						{getFieldDecorator("usedName", {
							initialValue: filter.usedName
						})(
							<Input placeholder="请输入供应商曾用名"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="供应商英文名称"
					>
						{getFieldDecorator("nameEn", {
							initialValue: filter.nameEn
						})(
							<Input placeholder="请输入供应商英文名称"/>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col {...colMiddleProps}>
					<Form.Item
						{...dateFormItemLayout}
						label="创建时间"
					>
						{getFieldDecorator("createTime", {
							initialValue: initialTimeRange
						})(
							<RangePicker
								showTime
								format={dateFormat}
								style={{width: "100%"}}
								placeholder={["起始时间", "终止时间"]}
							/>)
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
