import React from "react"
import {Button, Col, Form, Input, Row, Select} from "antd"
import {handleReset, patterns} from "../../../utils/form"

const Option = Select.Option

const FilterContent = ({filter, form, selectBillPeriod, onFilterChange}) => {
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
	const formItemLargerLayout = {
		labelCol: {
			xs: 24,
			sm: 6
		},
		wrapperCol: {
			xs: 24,
			sm: 18
		},
		style: {
			marginBottom: 16
		}
	}
	const colProps = {
		xs: 24,
		sm: 10
	}
	const colSmallProps = {
		xs: 24,
		sm: 7
	}
	const handleFilterReset = () => {
		handleReset(form,
			{period: selectBillPeriod.billPeriods.length > 0 ? selectBillPeriod.billPeriods[0].periodCode : ""}
		)
	}
	const handleChange = (key, e) => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				if (key) {
					const values = e.target.value
					fields[key] = values
					if (values.length < 6) {
						return
					}
				}
				fields.do = 1
				if (!fields.pageSize) {
					fields.pageSize = 100
				}
				onFilterChange(fields)
			}
		})
	}
	const handleSubmit = () => {
		handleChange()
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLargerLayout}
						label="账单账期"
					>
						{getFieldDecorator("period", {
							initialValue: filter.period || (selectBillPeriod.billPeriods[0]
								&& selectBillPeriod.billPeriods[0].periodCode)
						})(
							<Select
								allowClear
							>
								{selectBillPeriod.billPeriods.map(item =>
									(<Option key={item.periodCode}>
										{`${item.periodCode} (${item.fdate} 至 ${item.tdate})`}
									</Option>)
								)}
							</Select>)
						}
					</Form.Item>
				</Col>
				<Col {...colSmallProps}>
					<Form.Item
						{...formItemLayout}
						label="客户编号"
					>
						{getFieldDecorator("customCode", {
							initialValue: filter.customCode,
							rules: [{
								type: "string",
								pattern: patterns.digit,
								min: 5,
								max: 8,
								message: "请输入正确的客户号"
							}]
						})(
							<Input
								placeholder="请输入客户编号"
								onChange={handleChange.bind(null, "customCode")}
							/>)
						}
					</Form.Item>
				</Col>
				<Col {...colSmallProps}>
					<Form.Item
						{...formItemLayout}
						label="客户名称"
					>
						{getFieldDecorator("customName", {
							initialValue: filter.customName
						})(
							<Input
								placeholder="请输入客户名称"
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
