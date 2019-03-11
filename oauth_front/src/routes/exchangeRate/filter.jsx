import React from "react"
import {Button, Col, DatePicker, Form, Row, Select} from "antd"
import moment from "moment"
import {handleReset} from "../../utils/form"

const Option = Select.Option
const dateFormat = "YYYY-MM-DD"
const FilterContent = ({filter, form, selectCurrency, onFilterChange}) => {
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
	const handleFields = (fields) => {
		const {time} = fields
		if (time) {
			fields.time = time.format(dateFormat)
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
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="源币种"
					>
						{getFieldDecorator("orgCurrencyId", {
							initialValue: filter.orgCurrencyId
						})(
							<Select
								allowClear
							>
								{selectCurrency.currencies.map(item =>
									(<Option key={item.id}>{item.name}</Option>)
								)}
							</Select>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="目标币种"
					>
						{getFieldDecorator("targetCurrencyId", {
							initialValue: filter.targetCurrencyId
						})(
							<Select
								allowClear
							>
								{selectCurrency.currencies.map(item =>
									(<Option key={item.id}>{item.name}</Option>)
								)}
							</Select>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="有效时间"
					>
						{getFieldDecorator("time", {
							initialValue: filter.time === undefined || filter.time === null ?
								null : moment(filter.time)
						})(
							<DatePicker
								style={{width: "100%"}}
								allowClear
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
