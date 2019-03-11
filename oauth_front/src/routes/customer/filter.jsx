import React from "react"
import {AutoComplete, Button, Col, DatePicker, Form, Input, Row, Select, Icon} from "antd"
import moment from "moment"
import {handleReset} from "../../utils/form"
import {styles} from "../../components/layouts"
import {filter as companyFilter} from "../../utils/biz/company"
import PLATFORM_CONSTANTS from "../../constants/platform"
import DownloadFormModal from "./export/export"
import {EJF_STATUS_CONSTANTS} from "../../constants/ejfStatus"

const AOption = AutoComplete.Option
const {RangePicker} = DatePicker
const Option = Select.Option

const dateFormat = "YYYY-MM-DD HH:mm:ss"
const FilterContent = ({
	dispatch, filter, form, expand, onFilterChange, selectEmployee, selectCompany, user
}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const colProps = {
		xs: 24,
		sm: 8
	}
	const colMiddleProps = {
		xs: 24,
		sm: 12,
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
	const dateFormItemLayout = {
		labelCol: {
			xs: 24,
			sm: 5
		},
		wrapperCol: {
			xs: 24,
			sm: 19
		},
		style: {
			marginBottom: 16
		}
	}
	const handleFilterReset = () => {
		handleReset(form, {signedWithYanwen: "true"})
	}
	const handleFields = (fields) => {
		const {createTime, signTime} = fields
		if (createTime.length) {
			fields.createTime = [
				createTime[0].format(dateFormat),
				createTime[1].format(dateFormat)
			]
		}
		if (signTime.length) {
			fields.signTime = [
				signTime[0].format(dateFormat),
				signTime[1].format(dateFormat)
			]
		}
		return fields
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
				handleFields(fields)
				fields.do = 1
				onFilterChange(fields)
			}
		})
	}
	const handleSubmit = () => {
		handleChange()
	}
	const toggle = () => {
		dispatch({
			type: "customer/toggleFilter"
		})
	}
	// 获取销售经理
	const salesAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/salesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	// 获取对账客服
	const checksAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/checksAutoComplete",
			payload: {
				q: value
			}
		})
	}
	// 获取客服相关
	const receiptsAutoComplete = (value) => {
		dispatch({
			type: "selectEmployee/receiptsAutoComplete",
			payload: {
				q: value
			}
		})
	}
	// 获取所属公司
	const companySelection = () => {
		dispatch({
			type: "selectCompany/selection"
		})
	}
	const initialTimeRange = []
	if (filter.createTime && filter.createTime[0]) {
		initialTimeRange[0] = moment(filter.createTime[0])
	}
	if (filter.createTime && filter.createTime[1]) {
		initialTimeRange[1] = moment(filter.createTime[1])
	}
	const initalSignTimeRange = []
	if (filter.signTime && filter.signTime[0]) {
		initalSignTimeRange[0] = moment(filter.signTime[0])
	}
	if (filter.signTime && filter.signTime[1]) {
		initalSignTimeRange[1] = moment(filter.signTime[1])
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="客户"
					>
						{getFieldDecorator("customerCode", {
							initialValue: filter.customerCode
						})(
							<Input onChange={handleChange.bind(null, "customerCode")} placeholder="请输入客户／客户号"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="销售经理"
					>
						{getFieldDecorator("salesManagerCode", {
							initialValue: (user.sales && !user.dataAdmin) ? user.userId : filter.salesManagerCode
						})(
							<AutoComplete
								allowClear
								disabled={user.sales && !user.dataAdmin}
								placeholder="选择销售经理"
								onSearch={salesAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={(user.sales && !user.dataAdmin) ? [
									<AOption key={user.userId}>{user.username}</AOption>
								] : selectEmployee.sales.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="收款客服"
					>
						{getFieldDecorator("receivable", {
							initialValue: filter.receivableName
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
				</Col>
			</Row><Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="付款周期"
					>
						{getFieldDecorator("payCycle", {
							initialValue: filter.payCycle
						})(
							<Select allowClear placeholder="选择付款周期">
								<Option value="1">预付</Option>
								<Option value="2">周结</Option>
								<Option value="3">双周</Option>
								<Option value="4">四周</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="所属公司"
					>
						{getFieldDecorator("affiliatedCompanyId", {
							initialValue: filter.affiliatedCompanyId
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择所属公司"
								allowClear
								showSearch
								filterOption={companyFilter}
								onFocus={companySelection}
							>
								{selectCompany.companies.map(item =>
									(<Option key={item.id}>{item.name}</Option>)
								)}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="结算公司"
					>
						{getFieldDecorator("settleCompanyId", {
							initialValue: filter.settleCompanyId
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择结算公司"
								allowClear
								showSearch
								filterOption={companyFilter}
								onFocus={companySelection}
							>
								{selectCompany.companies.map(item =>
									(<Option key={item.id}>{item.name}</Option>)
								)}
							</Select>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{display: expand ? "block" : "none"}}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否正式"
					>
						{getFieldDecorator("signedWithYanwen", {
							initialValue: String(filter.signedWithYanwen || "")
						})(
							<Select allowClear>
								<Option value="true">正式客户</Option>
								<Option value="false">非正式客户</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="EJF状态"
					>
						{getFieldDecorator("ejfStatus", {
							initialValue: filter.ejfStatus
						})(
							<Select allowClear>
								{Array.from(EJF_STATUS_CONSTANTS).map(([key, value]) =>
									(<Option key={key} value={String(key)}>{value}</Option>))}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="属性是否缺失"
					>
						{getFieldDecorator("integrityFlag", {
							initialValue: filter.integrityFlag
						})(
							<Select allowClear placeholder="选择属性是否缺失">
								<Option value="false">是</Option>
								<Option value="true">否</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="客户类别"
					>
						{getFieldDecorator("customerType", {
							initialValue: filter.customerType
						})(
							<Select allowClear placeholder="选择客户类别">
								<Option key="customerType1" value="0">个人用户</Option>
								<Option key="customerType2" value="1">企业用户</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="客户服务级别"
					>
						{getFieldDecorator("customerServiceLevel", {
							initialValue: filter.customerServiceLevel
						})(
							<Select allowClear placeholder="选择客户服务级别">
								<Option value="0">超V</Option>
								<Option value="1">VIP</Option>
								<Option value="2">黑名单</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="信用等级"
					>
						{getFieldDecorator("creditLevel", {
							initialValue: filter.creditLevel
						})(
							<Select allowClear placeholder="选择信用等级">
								<Option value="65">A</Option>
								<Option value="66">B</Option>
								<Option value="67">C</Option>
								<Option value="68">D</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="平台来源"
					>
						{getFieldDecorator("source", {
							initialValue: filter.source
						})(
							<Select
								allowClear
								placeholder="选择平台来源"
							>
								{Array.from(PLATFORM_CONSTANTS).map(([key, value]) =>
									<Option key={key} value={String(key)}>{value}</Option>
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
								placeholder="选择对账客服"
								onSearch={checksAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={selectEmployee.checks.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{display: expand ? "block" : "none"}}>
				<Col {...colMiddleProps}>
					<Form.Item
						{...dateFormItemLayout}
						label="创建时间"
					>
						{getFieldDecorator("createTime", {
							initialValue: initialTimeRange
						})(
							<RangePicker
								showTime
								format={dateFormat}
								style={{width: "100%"}}
								placeholder={["起始时间", "终止时间"]}
							/>)
						}
					</Form.Item>
				</Col>
				<Col {...colMiddleProps}>
					<Form.Item
						{...dateFormItemLayout}
						label="开户时间"
					>
						{getFieldDecorator("signTime", {
							initialValue: initalSignTimeRange
						})(
							<RangePicker
								showTime
								format={dateFormat}
								style={{width: "100%"}}
								placeholder={["起始时间", "终止时间"]}
							/>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} offset={1} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
					<DownloadFormModal
						title="数据导出"
						dispatch={dispatch}
						user={user}
						selectEmployee={selectEmployee}
						selectCompany={selectCompany}
					>
						<Button type="ghost" style={{marginLeft: 8}}>数据导出</Button>
					</DownloadFormModal>
					<a className={styles.expand} onClick={toggle}>
						{expand ? "收起" : "展开"} <Icon type={expand ? "up" : "down"}/>
					</a>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
