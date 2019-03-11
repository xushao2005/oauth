import React from "react"
import lodash from "lodash"
import {Form, Input, AutoComplete, Select, Radio, Button, Row, Col, Spin, Tag} from "antd"
import {connect} from "dva"
import {styles} from "../../../components/layouts"
import {elementAuth} from "../../../utils/auth"
import {handleResetFields} from "../../../utils/form"
import {checkValidEmployee} from "../../../validators/employee"

const AOption = AutoComplete.Option
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const { TextArea } = Input
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
const PaymentInfoPage = ({supplier,
							 selectEmployee,
							 selectSupplierPaymentCompany,
							 selectSupplierPayCycle,
							 selectPaymentTerms,
							 selectCurrency,
							 resource,
							 loading,
							 form, dispatch}) => {
	const {currentSupplier: paymentInfo, editable} = supplier
	const {getFieldDecorator} = form
	const {supplierPayCycles} = selectSupplierPayCycle
	const {paymentTerms} = selectPaymentTerms
	const {currencies} = selectCurrency
	const companyDepartments = paymentInfo.companies
	const companyCodes = companyDepartments
		? companyDepartments.map(item => item.companyDepartmentCode) : undefined
	// 获取员工
	const employeesAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/employeesAutoComplete",
			payload: {
				q: value
			}
		})
	}

	let isTrialPhase = true
	if (paymentInfo.operationPhase) {
		isTrialPhase = paymentInfo.operationPhase === 1
	}
	const paymentCompanyFilter = (input, option) =>
		option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
	const currency = currencies.find(item => item.id === paymentInfo.currencyId)
	const checkValidEmployeeInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkValidEmployee(rule, values, callback)
	}
	return (
		<span>
			<Spin spinning={loading.effects["supplier/view"]}>
				<Form className={styles.modalForm}>
					<Form.Item
						{...formItemLayout}
						label="对账负责人"
					>
						{editable
							? getFieldDecorator("compareLeader", {
								initialValue: (paymentInfo.compareLeader || "").toString(),
								rules: [{
									required: !isTrialPhase,
									message: "必填"
								}, {
									validator: checkValidEmployeeInternal
								}]
							})(
								<AutoComplete
									allowClear
									placeholder="选择负责人"
									onSearch={employeesAutoComplete}
									dropdownMatchSelectWidth={false}
									dropdownStyle={{minWidth: 150}}
									dataSource={selectEmployee.employees.length > 0
										? selectEmployee.employees.map(item =>
											(<AOption key={item.id}>{item.name}</AOption>)
										)
										: (paymentInfo.compareLeader && [(<AOption key={paymentInfo.compareLeader}>
											{paymentInfo.compareLeaderName}</AOption>)])
									}
								/>
							)
							: paymentInfo.compareLeaderName
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="燕文付款公司"
					>
						{editable
							? getFieldDecorator("companyIds", {
								initialValue: companyCodes,
								rules: [{
									required: !isTrialPhase,
									message: "必填"
								}]
							})(
								<Select mode="multiple" filterOption={paymentCompanyFilter}>
									{selectSupplierPaymentCompany.companies.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
								</Select>
							)
							: companyDepartments ? companyDepartments
								.map(item =>
									(<Tag key={item.companyDepartmentCode}>{item.companyDepartmentName}</Tag>)) : null
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="付款方式"
					>
						{editable
							? getFieldDecorator("paymentTerm", {
								initialValue: (paymentInfo.paymentTerm || "").toString(),
								rules: [{
									required: !isTrialPhase,
									message: "必填"
								}]
							})(
								<RadioGroup>
									{Object.keys(paymentTerms).map(key => (
										<RadioButton key={key} value={key}>
											{paymentTerms[key]}
										</RadioButton>
									))
									}
								</RadioGroup>
							)
							: paymentTerms[paymentInfo.paymentTerm]
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="付款周期"
					>
						{editable
							? getFieldDecorator("payCycle", {
								initialValue: (paymentInfo.payCycle || "").toString(),
								rules: [{
									required: !isTrialPhase,
									message: "必填"
								}]
							})(
								<RadioGroup>
									{Object.keys(supplierPayCycles).map(key =>
										(<RadioButton key={key} value={key}>
											{supplierPayCycles[key]}
										</RadioButton>)
									)}
								</RadioGroup>
							)
							: supplierPayCycles[paymentInfo.payCycle]
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="付款币种"
					>
						{editable
							? getFieldDecorator("currencyId", {
								initialValue: String(paymentInfo.currencyId || ""),
								rules: [{
									required: !isTrialPhase,
									message: "必填"
								}]
							})(
								<Select>
									{currencies.map(item =>
										(<Option key={item.id}>{item.name}</Option>)
									)}
								</Select>
							)
							: currency && currency.name
						}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
						label="备注"
					>
						{editable
							? getFieldDecorator("mark", {
								initialValue: paymentInfo.mark,
							})(<TextArea rows={4}/>)
							: paymentInfo.mark
						}
					</Form.Item>
					<Form.Item
						style={{display: "none"}}
					>
						{getFieldDecorator("isPaymentInfo", {
							initialValue: true,
						})(<Input hidden/>)
						}
					</Form.Item>
				</Form>
			</Spin>
		</span>
	)
}

const mapStateToProps = ({supplier, selectEmployee, selectSupplierPaymentCompany,
							 selectSupplierPayCycle, selectPaymentTerms, selectCurrency,
							 resource, loading}) =>
	({supplier,
		selectEmployee,
		selectSupplierPaymentCompany,
		selectSupplierPayCycle,
		selectPaymentTerms,
		selectCurrency,
		resource,
		loading})

export default connect(mapStateToProps, null, null, {withRef: true})(Form.create()(PaymentInfoPage))
