import React from "react"
import {Form, Row, Col, Button, Select, AutoComplete} from "antd"
import {handleReset} from "../../utils/form"

const AOption = AutoComplete.Option
const Option = Select.Option

const Filter = ({dispatch, filter, onFilterChange, form, selectUnits,
	selectSupplier, selectService, transportMode, serviceCalcType}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const colProps = {
		xs: 24,
		sm: 8
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
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				// handleFields(fields)
				onFilterChange(fields)
			}
		})
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const supplierAutoComplete = (value) => {
		dispatch({
			type: "selectSupplier/selection",
			payload: {
				q: value
			}
		})
	}
	const serviceAutoComplete = (value) => {
		dispatch({
			type: "selectService/selection",
			payload: {
				q: value
			}
		})
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="供应商"
					>
						{getFieldDecorator("supplierCode", {
							initalValue: filter.supplierCode,
						})(
							<AutoComplete
								allowClear
								placeholder="请输入选择供应商"
								onSearch={supplierAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={selectSupplier.suppliers.map(item =>
									(<AOption key={item.code}>{item.nameCh}</AOption>)
								)}
							/>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="服务"
					>
						{getFieldDecorator("serviceCode", {
							initalValue: filter.serviceCode,
						})(
							<AutoComplete
								allowClear
								placeholder="请输入选择服务"
								onSearch={serviceAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={selectService.services.map(item =>
									(<AOption key={item.code}>{item.name}</AOption>)
								)}
							/>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="最小服务单元"
					>
						{getFieldDecorator("serviceUnitId", {
							initalValue: filter.serviceUnitId,
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择最小服务单元"
								allowClear
							>
								{selectUnits.units.map(item =>
									<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
			</Row><Row>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="运输方式"
					>
						{getFieldDecorator("transportId", {
							initalValue: filter.transportId
						})(
							<Select
								style={{width: "100%"}}
								placeholder="请选择运输方式"
								allowClear
							>
								{transportMode.list.map(item =>
									<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="计费维度"
					>
						{getFieldDecorator("calcType", {
							initalValue: filter.calcType
						})(
							<Select
								style={{width: "100%"}}
								placeholder="请选择计费维度"
								allowClear
							>
								{serviceCalcType.list.map(item =>
									<Option key={item.code} value={String(item.code)}>{item.desc}</Option>)
								}
							</Select>
						)
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

export default Form.create()(Filter)
