import React from "react"
import {connect} from "dva"
import {Table} from "antd"
import moment from "moment"
import Filter from "./filter"
import style from "../common/index.less"
import MoneySpan from "../common/moneySpan"

const DateFormat = "YYYY-MM-DD"
const BillDetailBody = ({custinf, transbill, dispatch, openbilldetail, selectProduct, loading}) => {
	const {list, pagination} = openbilldetail
	const filterProps = {
		dispatch,
		custinf,
		transbill,
		selectProduct,
		onFilterChange(fields) {
			dispatch({
				type: "openbilldetail/query",
				payload: {
					...fields,
				}
			})
		}
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["openbilldetail/query"],
		pagination,
		onChange(_pagination) {
			const {query} = openbilldetail
			dispatch({
				type: "openbilldetail/query",
				payload: {
					...query,
					page: _pagination.current,
					pageSize: _pagination.pageSize
				}
			})
		}
	}
	const columns = [
		{
			title: "运单号",
			dataIndex: "waybillNumber",
			key: "waybillNumber"
		},
		{
			title: "订单号",
			dataIndex: "orderCode",
			key: "orderCode"
		},
		{
			title: "转单号",
			dataIndex: "exchangeNumber",
			key: "exchangeNumber"
		},
		{
			title: "参考号",
			dataIndex: "yanwenNumber",
			key: "yanwenNumber"
		},
		{
			title: "快递单日期",
			dataIndex: "calcTime",
			key: "calcTime",
			render: calcTime => (calcTime === null ? null :
				moment(calcTime).format(DateFormat))
		},
		{
			title: "目的地",
			dataIndex: "destinationName",
			key: "destinationName"
		},
		{
			title: "重量（克）",
			dataIndex: "calcWeight",
			key: "calcWeight"
		},
		{
			title: "产品名称",
			dataIndex: "productName",
			key: "productName"
		},
		{
			title: "资费（元）",
			dataIndex: "calcPrice",
			key: "calcPrice",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		},
		{
			title: "折后资费（元）",
			dataIndex: "discountPrice",
			key: "discountPrice",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}, {
			title: "附加费（元）",
			dataIndex: "acctachPrice",
			key: "acctachPrice",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}, {
			title: "未出账单金额（元）",
			dataIndex: "afterDiscountFee",
			key: "afterDiscountFee",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}, {
			title: "所属区域",
			dataIndex: "areaName",
			key: "areaName"
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
				rowKey={record => record.waybillNumber}
			/>
		</div>
	)
}
const mapStateToProps = ({openbilldetail, selectProduct, resource, loading}) =>
	({openbilldetail, selectProduct, resource, loading})

export default connect(mapStateToProps)(BillDetailBody)
