import React from "react"
import {connect} from "dva"
import {Icon, notification, Popconfirm, Table} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import MoneySpan from "../common/moneySpan"
import Filter from "./filter"
import {elementAuth} from "../../../utils/auth"
import style from "../common/index.less"
import * as periodBillService from "../../../services/acc/periodbill"

const PeriodBillIndexPage = ({location, dispatch, periodBill, resource, selectBillPeriod,
								 loading}) => {
	const {list, pagination} = periodBill
	const filterProps = {
		dispatch,
		selectBillPeriod,
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
		loading: loading.effects["periodBill/query"],
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
	const handleExport = (record) => {
		periodBillService.exp(record).then((data) => {
			const {result, error, url} = data.data
			if (result) {
				window.open(url, "top")
			} else {
				notification.error({
					message: `${record.customCode} ${error}!`
				})
			}
		})
	}
	const handleResend = (record) => {
		const params = {
			period: record.billPeriod,
			customCode: record.customCode
		}
		periodBillService.resend(params).then((data) => {
			const {result, error} = data.data
			if (result) {
				notification.info({
					message: `${record.customCode} 账单补发成功!`
				})
			} else {
				notification.error({
					message: `${record.customCode} ${error}!`
				})
			}
		})
	}
	const columns = [
		{
			title: "客户编号",
			dataIndex: "customCode",
			key: "customCode"
		},
		{
			title: "客户姓名",
			dataIndex: "customName",
			key: "customName"
		},
		{
			title: "客户邮箱",
			dataIndex: "email",
			key: "email"
		},
		{
			title: "账单账期",
			dataIndex: "billPeriod",
			key: "billPeriod"
		},
		{
			title: "账期开始日",
			dataIndex: "fDate",
			key: "fDate"
		},
		{
			title: "账期截止日",
			dataIndex: "tDate",
			key: "tDate"
		},
		{
			title: "对账单数",
			dataIndex: "billCount",
			key: "billCount"
		},
		{
			title: "账单金额",
			dataIndex: "totalAmount",
			key: "totalAmount",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		},
		{
			title: "发送状态",
			dataIndex: "sendStatus",
			key: "sendStatus"
		}, {
			title: "操作",
			key: "action",
			width: 120,
			render: (text, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "补发账单", resource.currentResources) &&
						<Popconfirm title="确定补发账单？" onConfirm={() => handleResend(record)}>
							<div className="operationItem">
								<Icon type="mail"/>补发账单
							</div>
						</Popconfirm>}
					</span>
					<span className="operationItem">
						{elementAuth(location, "下载账单", resource.currentResources) &&
						<Popconfirm title="确定下载账单？" onConfirm={() => handleExport(record)}>
							<div className="operationItem">
								<Icon type="file-excel"/>下载账单
							</div>
						</Popconfirm>}
					</span>
				</div>
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
				rowKey={record => record.customCode}
			/>
		</div>
	)
}

const mapStateToProps = ({periodBill, resource, selectBillPeriod, loading}) =>
	({periodBill, resource, selectBillPeriod, loading})

export default connect(mapStateToProps)(PeriodBillIndexPage)
