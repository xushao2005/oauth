import React from "react"
import {connect} from "dva"
import {Icon, Table} from "antd"
import moment from "moment"
import Filter from "./filter"
import {styles} from "../../../components/layouts"
import BillDetailViewModal from "../billdetail/index"
import MoneySpan from "../common/moneySpan"
import style from "../common/index.less"

const DateFormat = "YYYY-MM-DD"
const TransBillBody = ({custinf, dispatch, transbill, loading}) => {
	const {list, pagination} = transbill
	const filterProps = {
		dispatch,
		custinf,
		onFilterChange(fields) {
			dispatch({
				type: "transbill/query",
				payload: {
					...fields,
				}
			})
		}
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["transbill/query"],
		pagination,
		onChange(_pagination) {
			const {query} = transbill
			dispatch({
				type: "transbill/query",
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
			title: "主单号",
			dataIndex: "mainNo",
			key: "mainNo"
		},
		{
			title: "客户编号",
			dataIndex: "cardcode",
			key: "cardcode"
		},
		{
			title: "结账周期",
			dataIndex: "billPeriod",
			key: "billPeriod"
		},
		{
			title: "交易类型",
			dataIndex: "transTypeName",
			key: "transTypeName"
		},
		{
			title: "是否调整",
			dataIndex: "isChange",
			key: "isChange",
			render: isChange => (isChange === "1" ? "是" : "否")
		},
		{
			title: "交易号",
			dataIndex: "transId",
			key: "transId",
			render: (text, record) => (
				<BillDetailViewModal
					dispatch={dispatch}
					payload={{mainNo: record.mainNo, transType: record.transType}}
					custinf={custinf}
					transbill={record}
				>
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</BillDetailViewModal>
			)
		},
		{
			title: "记账日期",
			dataIndex: "refDate",
			key: "refDate",
			render: refDate => (refDate === null || refDate === undefined ? null :
				moment(refDate).format(DateFormat))
		},
		{
			title: "到期日",
			dataIndex: "dueDate",
			key: "dueDate",
			render: dueDate => (dueDate === null || dueDate === undefined ? null :
				moment(dueDate).format(DateFormat))
		},
		{
			title: "收款金额",
			dataIndex: "receiveAmout",
			key: "receiveAmout",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}, {
			title: "账单金额",
			dataIndex: "billAmount",
			key: "billAmount",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}, {
			title: "调整金额",
			dataIndex: "changedAmount",
			key: "changedAmount",
			className: style.columnMoney,
			render: money => (
				<MoneySpan {...{money}}/>
			)
		}, {
			title: "账期开始时间",
			dataIndex: "startFDate",
			key: "startFDate",
			render: startFDate => (startFDate === null || startFDate === undefined ? null :
				moment(startFDate).format(DateFormat))
		}, {
			title: "账期结束时间",
			dataIndex: "endTDate",
			key: "endTDate",
			render: endTDate => (endTDate === null || endTDate === undefined ? null :
				moment(endTDate).format(DateFormat))
		},
		{
			title: "备注",
			dataIndex: "memo",
			key: "memo",
			width: 200
		}
	]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 1350}}
				rowKey={record => record.transId}
			/>
		</div>
	)
}
const mapStateToProps = ({transbill, resource, loading}) =>
	({transbill, resource, loading})

export default connect(mapStateToProps)(TransBillBody)
