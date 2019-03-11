import React from "react"
import {Button, Col, Form, Row, Select, Input} from "antd"
import queryString from "query-string"
import {handleReset} from "../../../utils/form"
import {checkText} from "../../../validators/customer/download"
import {customerApi} from "../../../constants/api"

const TextArea = Input.TextArea
const Option = Select.Option
const TabContent = ({form}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const colProps = {
		xs: 24,
		sm: 12
	}
	const formItemLayout = {
		labelCol: {
			xs: 24,
			sm: 7
		},
		wrapperCol: {
			xs: 24,
			sm: 17
		},
		style: {
			width: 330,
			marginBottom: 16
		}
	}
	const handleFilterReset = () => {
		handleReset(form)
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
				window.open(`${customerApi.customerExp}?${queryString.stringify(fields)}`, "top")
			}
		})
	}
	const handleSubmit = () => {
		handleChange()
	}
	const checkTextInter = (rule, value, callback) => {
		const {getFieldValue} = form
		const queryType = getFieldValue("queryType")
		const values = {
			queryType,
			queryText: value
		}
		checkText(rule, values, callback)
	}
	return (
		<Form layout="inline">
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="筛选条件"
					>
						{getFieldDecorator("queryType", {
							initialValue: null,
							rules: [{
								required: true,
								message: "必须选择一个条件"
							}]
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择筛选条件"
								allowClear
								showSearch>
								<Option key="customerCode">客户号</Option>
								<Option key="customerName">客户名称</Option>
							</Select>
						)}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col>
					<Form.Item
						{...formItemLayout}
						label="筛选内容"
					>
						{getFieldDecorator("queryText", {
							initialValue: null,
							rules: [{
								required: true,
								message: "必填"
							}, {
								validator: checkTextInter
							}]
						})(
							<TextArea
								placeholder="请输入客户号或客户名称，最多能同时输入500个客户号或客户名称，用回车符分割"
								autosize={{minRows: 6}}
							/>
						)}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} offset={1} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>数据导出</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(TabContent)
