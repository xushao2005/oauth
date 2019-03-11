import React from "react"
import {connect} from "dva"
import {Icon, Table} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {styles} from "../../../components/layouts"
import TransBillViewModal from "../transbill/index"
import MoneySpan from "../common/moneySpan"
import Filter from "./filter"
import style from "../common/index.less"

const CustinfIndexPage = ({location, dispatch, app, custinf, selectCompany,
							  selectPayCycle, selectEmployee, loading}) => {
	const {list, pagination} = custinf
	const {user} = app
	const filterProps = {
		dispatch,
		selectCompany,
		selectPayCycle,
		selectEmployee,
		user,
		filter: {
			...queryString.parse(location.search)
		},
		onFilterChange(fields) {
			dispatch(routerRedux.replace({
				pathname: location.pathname,
				search: queryString.stringify({
					...fields
				})
			}))
		}
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["custinf/query"],
		pagination,
		onChange (_pagination) {
			const {query, pathname} = location
			dispatch(routerRedux.replace({
				pathname,
				search: queryString.stringify({
					...query,
					page: _pagination.current,
					pageSize: _pagination.pageSize
				})
			}))
		}
	}
	const columns = [
		{
			title: "客户编号",
			dataIndex: "customerCode",
			key: "customerCode"
		},
		{
			title: "客户名称",
			dataIndex: "customerName",
			key: "customerName",
			render: (text, record) => (
				<TransBillViewModal
					title="对账单信息"
					dispatch={dispatch}
					payload={{customCode: record.customerCode}}
					custinf={record}
				>
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</TransBillViewModal>
			)
		},
		{
			title: "销售经理",
			dataIndex: "salesManagerName",
			key: "salesManagerName"
		},
		{
			title: "对账客服",
			dataIndex: "reconciliationClerkName",
			key: "reconciliationClerkName"
		},
		{
			title: "收款客服",
			dataIndex: "receivableName",
			key: "receivableName"
		},
		{
			title: "结算公司",
			dataIndex: "settleCompanyName",
			key: "settleCompanyName"
		},
		{
			title: "付款周期",
			dataIndex: "payCycle",
			key: "payCycle"
		},
		{
			title: "账户余额（元）",
			dataIndex: "SettledBalance",
			key: "SettledBalance",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		},
		{
			title: "未出账单金额（元）",
			dataIndex: "unSettledBalance",
			key: "unSettledBalance",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		},
		{
			title: "可用余额（元）",
			dataIndex: "useBalance",
			key: "useBalance",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}
	]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 850}}
				rowKey={record => record.customerCode}
			/>
		</div>
	)
}

const mapStateToProps = ({app, custinf, customer, resource, selectCompany, selectPayCycle,
							 selectEmployee, loading}) =>
	({app, custinf, customer, resource, selectCompany, selectPayCycle, selectEmployee, loading})

export default connect(mapStateToProps)(CustinfIndexPage)
