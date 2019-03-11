import React from "react"
import {AutoComplete, Button, Col, Form, Icon, Input, Row, Select, notification} from "antd"
import {handleReset} from "../../../utils/form"
import * as custinfService from "../../../services/acc/custinf"
import {filter as companyFilter} from "../../../utils/biz/company"

const AOption = AutoComplete.Option
const Option = Select.Option

const FilterContent = ({dispatch, filter, form, selectCompany, selectPayCycle,
						   selectEmployee, user, onFilterChange}) => {
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
	const salesAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/salesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	const checksAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/checksAutoComplete",
			payload: {
				q: value
			}
		})
	}
	const receiptsAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/receiptsAutoComplete",
			payload: {
				q: value
			}
		})
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
	const handleExport = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				custinfService.exp(fields).then((data) => {
					const {result, url, error} = data.data
					if (result) {
						window.open(url, "top")
					} else {
						notification.warn({
							message: error
						})
					}
				})
			}
		})
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="客户"
					>
						{getFieldDecorator("customer", {
							initialValue: filter.customer
						})(
							<Input
								onChange={handleChange.bind(null, "customer")}
								placeholder="请输入客户/客户号"
							/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="结算公司"
					>
						{getFieldDecorator("settleCompany", {
							initialValue: filter.settleCompany
						})(
							<Select
								allowClear
								showSearch
								filterOption={companyFilter}
							>
								{selectCompany.companies.filter(item => item.settle)
									.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
							</Select>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="付款周期"
					>
						{getFieldDecorator("payCycle", {
							initialValue: filter.payCycle
						})(
							<Select
								allowClear
							>
								{selectPayCycle.payCycles.map(item =>
									(<Option key={item.id}>{item.desc}</Option>)
								)}
							</Select>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="对账客服"
					>
						{getFieldDecorator("reconciliationClerk", {
							initialValue: filter.reconciliationClerk
						})(
							<AutoComplete
								allowClear
								placeholder="请输入对账客服姓名"
								onSearch={checksAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{width: 150}}
								dataSource={selectEmployee.checks.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="收款客服"
					>
						{getFieldDecorator("receivable", {
							initialValue: filter.receivable
						})(
							<AutoComplete
								allowClear
								placeholder="请输入收款客服姓名"
								onSearch={receiptsAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{width: 150}}
								dataSource={selectEmployee.receipts.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="销售经理"
					>
						{getFieldDecorator("salesManager", {
							initialValue: (user.sales && !user.dataAdmin) ? user.userId : filter.salesManager
						})(
							<AutoComplete
								allowClear
								disabled={user.sales && !user.dataAdmin}
								placeholder="请选择销售经理"
								onSearch={salesAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{width: 150}}
								dataSource={(user.sales && !user.dataAdmin) ? [
									<AOption key={user.userId}>{user.username}</AOption>
								] : selectEmployee.sales.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} offset={1} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="primary" style={{marginLeft: 8}} onClick={handleExport}><Icon type="download"/>导出Excel</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
