import React from "react"
import {connect} from "dva"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {Table, Icon, Row, Button} from "antd"
import CustomerViewModal from "./tabView"
import CustomerFormModal from "./form"
import {styles} from "../../components/layouts"
import {elementAuth} from "../../utils/auth"
import Filter from "./filter"

const customerManagement = ({location, dispatch, app, customer,
	resource, loading, selectEmployee, selectCompany}) => {
	const {list, pagination, editable, mainTab, current, cacheCustomer, expand, currentTab} = customer
	const {isShowInitPersonal, isShowInitCompany} = customer.currentCustomer
	const {user} = app
	const listProps = {
		dataSource: list,
		pagination,
		loading: loading.effects["customer/query"] || loading.effects["customer/remove"],
		onChange(_pagination) {
			const {query, pathname} = location
			dispatch(routerRedux.replace({
				pathname: pathname,
				search: queryString.stringify({
					...query,
					page: _pagination.current,
					pageSize: _pagination.pageSize
				})
			}))
		}
	}
	const filterProps = {
		dispatch,
		filter: {
			...queryString.parse(location.search)
		},
		selectEmployee,
		selectCompany,
		user,
		expand,
		onFilterChange(fields) {
			dispatch(routerRedux.replace({
				pathname: location.pathname,
				search: queryString.stringify({
					...fields
				})
			}))
		}
	}
	const updateHandler = (code, values) => {
		dispatch({
			type: "customer/update",
			payload: {
				customerCode: code,
				...values,
				query: queryString.parse(location.search)
			}
		})
	}
	const columns = [
		{
			title: "客户号",
			dataIndex: "customerCode",
			key: "customerCode",
			width: 100,
			fixed: "left"
		}, {
			title: "客户名称",
			dataIndex: "customerName",
			key: "customerName",
			width: 120,
			fixed: "left",
			render: (text, record) => (
				<CustomerViewModal
					title={`客户号: ${record.customerCode}`}
					dispatch={dispatch}
					viewLoading={loading.effects["customer/view"]}
					updateLoading={loading.effects["customer/update"]}
					payload={{customerCode: record.customerCode}}
					location={location}
					editable={editable}
					mainTab={mainTab}
					isShowInitPersonal={isShowInitPersonal}
					isShowInitCompany={isShowInitCompany}
					customer={customer}
					resource={resource}
					currentTab={currentTab}
					onOk={updateHandler.bind(null, record.customerCode)}
				>
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</CustomerViewModal>
			)
		}, {
			title: "销售经理",
			dataIndex: "salesManagerName",
			key: "salesManagerName"
		}, {
			title: "收款客服",
			dataIndex: "receivableName",
			key: "receivableName"
		}, {
			title: "付款周期",
			dataIndex: "payCycleName",
			key: "payCycleName"
		}, {
			title: "EJF状态",
			dataIndex: "ejfStatusDesc",
			key: "ejfStatusDesc"
		}, {
			title: "所属公司",
			dataIndex: "currentAffiliatedCompanyName",
			key: "currentAffiliatedCompanyName"
		}, {
			title: "结算公司",
			dataIndex: "currentSettleCompanyName",
			key: "currentSettleCompanyName"
		}, {
			title: "合同编号",
			dataIndex: "contractCode",
			key: "contractCode"
		}, {
			title: "联系人",
			dataIndex: "contactName",
			key: "contactName"
		}, {
			title: "联系电话",
			dataIndex: "contactPhone",
			key: "contactPhone"
		}, {
			title: "联系地址",
			dataIndex: "contactAddress",
			key: "contactAddress",
			render: (text, record) =>
				<span>{record.province}{record.city}{record.district}{record.streetAddress}</span>
		}, {
			title: "Email",
			dataIndex: "email",
			key: "email"
		}, {
			title: "客户类型",
			dataIndex: "customerTypeName",
			key: "customerTypeName"
		}, {
			title: "客户服务级别",
			dataIndex: "customerServiceLevelName",
			key: "customerServiceLevelName"
		}, {
			title: "信用等级",
			dataIndex: "creditLevelName",
			key: "creditLevelName"
		}, {
			title: "信用额度",
			dataIndex: "creditLimit",
			key: "creditLimit"
		}, {
			title: "平台来源",
			dataIndex: "sourceName",
			key: "sourceName"
		}, {
			title: "备注",
			dataIndex: "remark",
			key: "remark"
		}, {
			title: "对账客服",
			dataIndex: "reconciliationClerkName",
			key: "reconciliationClerkName"
		}, {
			title: "TMS状态",
			dataIndex: "tmsStatusDesc",
			key: "tmsStatusDesc"
		}, {
			title: "创建时间",
			dataIndex: "addTime",
			key: "addTime"
		}, {
			title: "开户时间",
			dataIndex: "signedTime",
			key: "signedTime"
		}
	]

	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Row>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增客户", resource.currentResources) && <CustomerFormModal
						title="新增客户向导"
						location={location}
						current={current}
						payload={{customerCode: cacheCustomer.customerCode}}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</CustomerFormModal>}
				</div>
			</Row>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 2800}}
				rowKey={record => record.customerCode}
			/>
		</div>
	)
}

const mapStateToProps = ({app, customer, resource, loading, selectEmployee, selectCompany}) =>
	({app, customer, resource, loading, selectEmployee, selectCompany})
export default connect(mapStateToProps)(customerManagement)
