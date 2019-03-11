import React from "react"
import {connect} from "dva"
import {Table} from "antd"
import moment from "moment"
import Filter from "./filter"
import MoneySpan from "../common/moneySpan"
import style from "../common/index.less"

const DateFormat = "YYYY-MM-DD"
const BillDetailReturnBody = ({custinf, transbill, dispatch, billdetail,
								  selectProduct, loading}) => {
	const {list, pagination} = billdetail
	const filterProps = {
		dispatch,
		custinf,
		transbill,
		selectProduct,
		onFilterChange(fields) {
			dispatch({
				type: "billdetail/query",
				payload: {
					...fields,
				}
			})
		}
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["billdetail/query"],
		pagination,
		onChange(_pagination) {
			const {query} = billdetail
			dispatch({
				type: "billdetail/query",
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
			title: "快递单日期",
			dataIndex: "calcTime",
			key: "calcTime",
			render: calcTime => (calcTime === null || calcTime === undefined ? null :
				moment(calcTime).format(DateFormat))
		},
		{
			title: "创建日期",
			dataIndex: "dataCreateTime",
			key: "dataCreateTime",
			render: dataCreateTime => (dataCreateTime === null || dataCreateTime === undefined ? null :
				moment(dataCreateTime).format(DateFormat))
		},
		{
			title: "产品名称",
			dataIndex: "productName",
			key: "productName"
		},
		{
			title: "客户号",
			dataIndex: "customerCode",
			key: "customerCode"
		},
		{
			title: "客户名称",
			dataIndex: "customerName",
			key: "customerName"
		}, {
			title: "国家",
			dataIndex: "regionName",
			key: "regionName"
		}, {
			title: "重量",
			dataIndex: "calcWeight",
			key: "calcWeight"
		}, {
			title: "账单金额",
			dataIndex: "arPrice",
			key: "arPrice",
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
				rowKey={record => record.waybillNumber}
			/>
		</div>
	)
}
const mapStateToProps = ({billdetail, selectProduct, resource, loading}) =>
	({billdetail, selectProduct, resource, loading})

export default connect(mapStateToProps)(BillDetailReturnBody)
