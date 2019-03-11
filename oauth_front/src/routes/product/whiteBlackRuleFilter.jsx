import React from "react"
import {Form, Row, Col, Input, Button} from "antd"
import {handleReset} from "../../utils/form"

const { TextArea } = Input
const WhiteBlackRuleFilter = ({form, onFilterChange, customerCode}) => {
	const colProps = {
		xs: 24,
		sm: 6
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
			marginBottom: 16
		}
	}
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				onFilterChange(fields)
			}
		})
	}
	const handleFilterReset = () => {
		handleReset(form)
		onFilterChange({code: undefined})
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="按客户检索"
					>
						{getFieldDecorator("code", {
							initialValue: customerCode
						})(
							<TextArea rows={4} placeholder="请输入客户／客户号，用回车符分割"/>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps} style={{marginLeft: 20, marginTop: 1}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(WhiteBlackRuleFilter)
