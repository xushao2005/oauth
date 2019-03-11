import React from "react"
import {AutoComplete, Radio, Form, Select, Input} from "antd"
import {connect} from "dva"
import {styles} from "../../../components/layouts"
import {filter as companyFilter} from "../../../utils/biz/company"
import {checkReceiptCode} from "../../../validators/customer/customerReceiver"
import {checkSaleCode} from "../../../validators/customer/customerSales"

const RadioGroup = Radio.Group
const AOption = AutoComplete.Option
const Option = Select.Option

const CustomerEntryForm = ({dispatch, customer, selectCompany, selectEmployee, form}) => {
	const {getFieldDecorator} = form
	const {cacheCustomer} = customer
	const formItemLayout = {
		labelCol: {
			xs: {span: 24},
			sm: {span: 4}
		},
		wrapperCol: {
			xs: {span: 24},
			sm: {span: 20}
		},
		style: {
			maxWidth: 600,
			margin: "16px auto"
		}
	}
	const salesAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/salesAutoComplete",
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
	// 检测 销售经理
	const checkCurrentSaleManagerIdInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkSaleCode(rule, values, callback)
	}
	// 检测 收款客服
	const checkReceivableInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkReceiptCode(rule, values, callback)
	}
	// 显示所属公司对应的结算公司
	const handleAffiliatedCompanyChange = (value) => {
		//清空所属公司情况
		if (value === undefined || value === null) {
			form.setFieldsValue({currentSettleCompanyName: ""})
			return
		}
		let settleCompany
		const affiliatedCompany = selectCompany.companies.find(item => item.id === value)
		if (affiliatedCompany.settle === true) {
			settleCompany = affiliatedCompany
		} else {
			settleCompany = selectCompany.companies
				.find(item => item.id === affiliatedCompany.settleCompanyCode)
		}
		if (settleCompany && settleCompany.name) {
			form.setFieldsValue({currentSettleCompanyName: settleCompany.name})
		}
	}
	//校验所属公司
	const checkAffiliatedCompany = (rule, value, callback) => {
		if (value) {
			const affiliatedCompany = selectCompany.companies.find(item => item.id === value)
			if (affiliatedCompany.settle !== true && !affiliatedCompany.settleCompanyCode) {
				callback("所属公司未指定对应结算公司")
			}
		}
		callback()
	}
	return (
		<Form className={styles.modalForm}>
			<Form.Item
				{...formItemLayout}
				label="客户类型"
			>
				{getFieldDecorator("customerType", {
					initialValue: cacheCustomer.customerType || 0,
					rules: [{
						required: true,
						message: "必填"
					}]
				})(
					<RadioGroup disabled={cacheCustomer.customerType !== undefined}>
						<Radio value={0}>个人用户</Radio>
						<Radio value={1}>企业用户</Radio>
					</RadioGroup>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="所属公司"
			>
				{getFieldDecorator("currentAffiliatedCompanyId", {
					initialValue: cacheCustomer.currentAffiliatedCompanyId,
					rules: [{
						required: true,
						message: "必填"
					}, {
						validator: checkAffiliatedCompany
					}]
				})(
					<Select
						disabled={cacheCustomer.currentAffiliatedCompanyId !== undefined}
						style={{width: "100%"}}
						placeholder="选择所属公司"
						allowClear
						showSearch
						filterOption={companyFilter}
						onChange={handleAffiliatedCompanyChange}
					>
						{selectCompany.companies.map(item =>
							(<Option key={item.id}>{item.name}</Option>)
						)}
					</Select>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="结算公司"
			>
				{getFieldDecorator("currentSettleCompanyName", {
					initialValue: cacheCustomer.currentSettleCompanyName,
					rules: []
				})(
					<Input disabled/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="销售经理"
			>
				{getFieldDecorator("currentSaleManagerId", {
					initialValue: cacheCustomer.currentSaleManagerId,
					rules: [{
						required: true,
						message: "必填"
					}, {
						validator: checkCurrentSaleManagerIdInternal
					}]
				})(
					<AutoComplete
						allowClear
						placeholder="选择销售经理"
						onSearch={salesAutoComplete}
						dropdownMatchSelectWidth={false}
						dropdownStyle={{minWidth: 150}}
						dataSource={selectEmployee.sales.map(item =>
							(<AOption key={item.id}>{item.name}</AOption>)
						)}
					/>
				)
				}
			</Form.Item>
			<Form.Item
				{...formItemLayout}
				label="收款客服"
			>
				{getFieldDecorator("receivable", {
					initialValue: cacheCustomer.receivable,
					rules: [{
						required: true,
						message: "必填"
					}, {
						validator: checkReceivableInternal
					}]
				})(
					<AutoComplete
						allowClear
						placeholder="选择收款客服"
						onSearch={receiptsAutoComplete}
						dropdownMatchSelectWidth={false}
						dropdownStyle={{minWidth: 150}}
						dataSource={selectEmployee.receipts.map(item =>
							(<AOption key={item.id}>{item.name}</AOption>)
						)}
					/>
				)
				}
			</Form.Item>
		</Form>
	)
}

const mapStateToProps = ({customer, selectCompany, selectEmployee, loading}) =>
	({customer, selectCompany, selectEmployee, loading})

export default connect(mapStateToProps, null, null,
	{withRef: true})(Form.create()(CustomerEntryForm))
