import React from "react"
import queryString from "query-string"
import {AutoComplete, Button, Col, Form, notification, Row, Select} from "antd"
import {handleReset} from "../../../utils/form"
import {filter as companyFilter} from "../../../utils/biz/company"
import {customerApi} from "../../../constants/api"

const AOption = AutoComplete.Option
const Option = Select.Option

const TabContent = ({
	dispatch, form, selectEmployee, selectCompany, user
}) => {
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
		handleReset(form, {signedWithYanwen: "true"})
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
				const {salesManagerCode, receivable} = fields
				if (!(salesManagerCode || receivable)) {
					notification.warn({
						message: "销售经理和收款客服至少选择一个"
					})
				} else {
					window.open(`${customerApi.customerServiceExp}?${queryString.stringify(fields)}`, "top")
				}
			}
		})
	}
	const handleSubmit = () => {
		handleChange()
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
	return (
		<Form layout="inline">
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="销售经理"
					>
						{getFieldDecorator("salesManagerCode", {
							initialValue: user.sales ? user.userId : ""
						})(
							<AutoComplete
								allowClear
								disabled={user.sales && !user.dataAdmin}
								placeholder="选择销售经理"
								onSearch={salesAutoComplete}
								dropdownMatchSelectWidth={false}
								dropdownStyle={{minWidth: 150}}
								dataSource={user.sales ? [
									<AOption key={user.userId}>{user.username}</AOption>
								] : selectEmployee.sales.map(item =>
									(<AOption key={item.id}>{item.name}</AOption>)
								)}
							/>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="收款客服"
					>
						{getFieldDecorator("receivable", {
							initialValue: null
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
			</Row>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="所属公司"
					>
						{getFieldDecorator("affiliatedCompanyId", {
							initialValue: null
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
			</Row>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否正式"
					>
						{getFieldDecorator("signedWithYanwen", {
							initialValue: String(true || "")
						})(
							<Select allowClear>
								<Option value="true">正式客户</Option>
								<Option value="false">非正式客户</Option>
							</Select>
						)
						}
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
