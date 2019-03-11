import React from "react"
import {Button, Col, Form, Input, Row} from "antd"
import {handleReset, patterns} from "../../utils/form"

const FilterContent = ({filter, form, onFilterChange}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const formItemLayout = {
		labelCol: {
			xs: 24,
			sm: 9
		},
		wrapperCol: {
			xs: 24,
			sm: 15,
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
						label="国家编码"
					>
						{getFieldDecorator("id", {
							initialValue: filter.id
						})(
							<Input placeholder="请输入国家编码"/>)
						}
					</Form.Item>
				</Col>
				{/* <Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="中文名称"
					>
						{getFieldDecorator("chineseName", {
							initialValue: filter.chineseName
						})(
							<AutoComplete
								allowClear
								placeholder="请输入中文名称"
								onSearch={regionAutoComplete.bind(null, "CN")}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{width: 150}}
								dataSource={selectRegion.regions.map(item =>
									(<AOption key={item.id ? item.id : item.chinesename}>{item.chinesename}</AOption>)
								)}
							/>)
						}
					</Form.Item>
				</Col> */}
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="中文名称"
					>
						{getFieldDecorator("chineseName", {
							initialValue: filter.chineseName,
							rules: [{
								pattern: patterns.character,
								message: "请输入合法的中文名称"
							}]
						})(
							<Input placeholder="请输入中文名称"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="英文名称"
					>
						{getFieldDecorator("englishName", {
							initialValue: filter.englishName,
							rules: [{
								pattern: patterns.english,
								message: "请输入合法的英文名称"
							}]
						})(
							<Input placeholder="请输入英文名称"/>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} style={{textAlign: "left"}} offset={1}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
