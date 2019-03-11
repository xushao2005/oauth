import React from "react"
import {connect} from "dva"
import {AutoComplete, Col, Form, Icon, Input, Popover, Radio, Row, Spin} from "antd"
import PaymentIndexPage from "./payment/index"
import AffiliatedIndexPage from "./affiliated/index"
import SettleIndexPage from "./settle/index"
import * as customerService from "../../../services/customer/customer"
import {elementAuth} from "../../../utils/auth"
import styles from "./index.less"
import {checkCheckingCode} from "../../../validators/customer/customer"
import ListPopoverView from "../../../components/data/listPopoverView"
import {PAY_CYCLE_CONSTANTS} from "../../../constants/payCycle"

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const AOption = AutoComplete.Option

const FinanceIndexPage = ({
	location, dispatch, customer, customerFinance, form,
	selectEmployee, resource, loading
}) => {
	const {currentCustomer} = customer
	const {editable, mainAccountId, mainAccounts, mainCustomers} = customerFinance
	const {getFieldDecorator} = form
	const handleEdit = () => {
		dispatch({
			type: "customerFinance/handleEditable",
			payload: {
				isEdit: !editable
			}
		})
	}
	const updataHandle = (values) => {
		dispatch({
			type: "customer/updateFinance",
			payload: {
				customerCode: currentCustomer.customerCode,
				dispatch: dispatch,
				...values
			}
		})
		dispatch({
			type: "customerFinance/clearMainCustomers"
		})
	}
	const okHandler = () => {
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				updataHandle(values)
				handleEdit()
			}
		})
	}
	const closeEditView = () => {
		handleEdit()
	}
	const checksAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/checksAutoComplete",
			payload: {
				q: value
			}
		})
	}
	const checkPayAccount = async (rule, value, callback) => {
		if (!value) {
			callback()
		} else {
			const {data} = await customerService.validPayAccount(
				{
					customerCode: currentCustomer.customerCode,
					payAccount: value
				})
			if (data.success) {
				callback()
			} else {
				callback(data.message)
			}
		}
	}
	const formItemLayout = {
		labelCol: {
			xs: {span: 24},
			sm: {span: 6}
		},
		wrapperCol: {
			xs: {span: 24},
			sm: {span: 18}
		},
		style: {
			maxWidth: 600
		}
	}
	// 检验 对账客服存在
	const checkCheckingCodeInternal = (rule, value, callback) => {
		const values = {
			code: value
		}
		checkCheckingCode(rule, values, callback)
	}
	// 鼠标控制显示付款主客户或者关联客服信息
	const handleShowMainCustomerPopover = (value) => {
		dispatch({
			type: "customerFinance/changeMainAccountId",
			payload: value
		})
	}
	// 自动补全 mainCustomers 数据
	const getMainCustomers = (value) => {
		if (value) {
			dispatch({
				type: "customerFinance/queryMainCustomers",
				payload: {
					customerCode: value
				}
			})
		}
	}
	return (
		<span>
			<div style={{marginBottom: "20px"}}>
				<Spin spinning={loading.effects["customerFinance/mainAccounts"]}>
					<Form style={{margin: "20px 0"}}>
						<Row>
							<Col span={3} style={{marginTop: -15}}>
								<div className={styles.operation}>
									{elementAuth(location, "编辑财务信息", resource.currentResources) && <div>
										{editable
											? (<span>
												<span className={styles.operationItem} onClick={okHandler}>
													<Icon type="save"/>保存
												</span>
												<span className={styles.operationItem} onClick={closeEditView}>
													<Icon type="close"/>取消
												</span>
											</span>)
											: (<span className={styles.operationItem} onClick={handleEdit}><Icon type="edit"/>编辑</span>)
										}
									</div>}
								</div>
							</Col>
							<Col span={9}>
								<Form.Item
									{...formItemLayout}
									label="客户信用等级"
								>
									{editable
										? getFieldDecorator("creditLevel", {
											initialValue: currentCustomer.creditLevel,
											rules: [{
												required: true,
												message: "必填"
											}]
										})(
											<RadioGroup>
												<RadioButton value={"A".charCodeAt()}>A</RadioButton>
												<RadioButton value={"B".charCodeAt()}>B</RadioButton>
												<RadioButton value={"C".charCodeAt()}>C</RadioButton>
												<RadioButton value={"D".charCodeAt()}>D</RadioButton>
											</RadioGroup>
										)
										: currentCustomer.creditLevelName
									}
								</Form.Item>
							</Col>
							<Col span={9}>
								<Form.Item
									{...formItemLayout}
									label={<span>付款周期&nbsp;
										{currentCustomer.payAccount && currentCustomer.payAccount.length > 5 &&
										<Popover content="请转至主付款客户统一修改付款周期">
											<Icon type="question-circle-o"/>
										</Popover>}</span>}
								>
									{editable
										? getFieldDecorator("payCycle", {
											initialValue: currentCustomer.payCycle || 1,
											rules: [{
												required: true,
												message: "必填"
											}]
										})(<RadioGroup
											style={{marginRight: 5}}
											disabled={currentCustomer.payAccount && currentCustomer.payAccount.length > 5}
										>
											{Array.from(PAY_CYCLE_CONSTANTS).map(([key, value]) =>
												(<RadioButton key={key} value={key}>{value}</RadioButton>))}
										</RadioGroup>)
										: currentCustomer.payCycleName
									}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={9} offset={3}>
								<Form.Item
									{...formItemLayout}
									label="客户信用额度"
								>
									{editable
										? getFieldDecorator("creditLimit", {
											initialValue: (currentCustomer.creditLimit || 0).toString(),
											rules: [{
												required: true,
												message: "必填"
											}, {
												type: "string",
												pattern: "^\\d{0,5}$|^100000$",
												message: "必须为0～100000的数字"
											}]
										})(
											<Input/>
										)
										: currentCustomer.creditLimit
									}
								</Form.Item>
							</Col>
							<Col span={9}>
								<Form.Item
									{...formItemLayout}
									label="对账客服"
								>
									{editable
										? getFieldDecorator("reconciliationClerk", {
											initialValue: (currentCustomer.reconciliationClerk || "").toString(),
											rules: [{
												required: true,
												message: "必填"
											}, {
												validator: checkCheckingCodeInternal
											}]
										})(
											<AutoComplete
												allowClear
												placeholder="选择对账客服"
												onSearch={checksAutoComplete}
												dropdownMatchSelectWidth={false}
												dropdownStyle={{minWidth: 150}}
												dataSource={selectEmployee.checks.length > 0
													? selectEmployee.checks.map(item =>
														(<AOption key={item.id}>{item.name}</AOption>))
													: [(<AOption key={currentCustomer.reconciliationClerk}>
														{currentCustomer.reconciliationClerkName}</AOption>)]
												}
											/>
										)
										: currentCustomer.reconciliationClerkName
									}
								</Form.Item>
							</Col>
							<Col span={9} offset={3}>
								<Form.Item
									{...formItemLayout}
									label={(((currentCustomer.payAccount && mainAccounts.length > 0) || (!currentCustomer.payAccount && !mainAccounts.length) || editable)) ? "付款主客户号" : "关联客户号"}
								>
									{editable
										? getFieldDecorator("payAccount", {
											initialValue: (currentCustomer.payAccount || "").toString(),
											rules: [{
												validator: checkPayAccount
											}]
										})(
											<AutoComplete
												disabled={!currentCustomer.payAccount && mainAccounts.length > 0}
												allowClear
												placeholder={!currentCustomer.payAccount && mainAccounts.length > 0 ? "您已经是付款客户，不能指定付款客户" : "请设置付款主客户"}
												onSearch={getMainCustomers}
												dropdownMatchSelectWidth={false}
												dropdownStyle={{width: 300}}
												dataSource={mainCustomers.map(item =>
													(<AOption key={item.customerCode} value={item.customerCode}>
														{`${item.customerName} - (付款周期：${item.payCycleName})`}
													</AOption>)
												)}
											/>
										)
										: (<ListPopoverView
											popoverContent={["customerCode", "客户名称", "customerName"]}
											list={mainAccounts}
											currCustomer={
												mainAccounts.filter(it => it.customerCode === mainAccountId)[0] || {}}
											dispatch={dispatch}
											handleMouseEvent={handleShowMainCustomerPopover}
										/>)
									}
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Spin>
			</div>
			<hr/>
			<div style={{marginTop: "20px"}}>
				<AffiliatedIndexPage location={location}/>
				<SettleIndexPage location={location}/>
				<PaymentIndexPage location={location}/>
			</div>
		</span>
	)
}

const mapStateToProps = ({customer, customerFinance, selectEmployee, resource, loading}) =>
	({customer, customerFinance, selectEmployee, resource, loading})

export default connect(mapStateToProps)(Form.create()(FinanceIndexPage))
