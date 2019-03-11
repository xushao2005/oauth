import React from "react"
import {Form, Input, Row, Col, Button, notification, Select} from "antd"
import {hasValues, handleReset} from "../../utils/form"
import PLATFORM_CONSTANTS from "../../constants/platform"

const Option = Select.Option

const Filter = ({form, onFilterChange}) => {
	const {getFieldDecorator, getFieldsValue, validateFieldsAndScroll} = form
	const colProps = {
		xs: 24,
		sm: 8
	}
	const formItemProps = {
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
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!hasValues(form)) {
				notification.warn({
					message: "必须至少指定一个搜索条件"
				})
				return
			}
			if (!err) {
				const fields = getFieldsValue()
				onFilterChange(fields)
			}
		})
	}
	const handleFilterReset = () => {
		handleReset(form)
		onFilterChange({})
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item {...formItemProps} label="平台客户号">
						{getFieldDecorator("plamCode")(
							<Input placeholder="请输入平台客户号"/>
						)}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item {...formItemProps} label="平台类型">
						{getFieldDecorator("customerPlam")(
							<Select allowClear placeholder="选择平台类型">
								{Array.from(PLATFORM_CONSTANTS).map(([key, value]) =>
									<Option key={key} value={String(key)}>{value}</Option>
								)}
							</Select>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" onClick={handleFilterReset} style={{marginLeft: 8, marginRight: 8}}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(Filter)
