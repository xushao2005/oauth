import React from "react"
import {connect} from "dva"
import {Table, Row, Button} from "antd"
import SettleFormModal from "./form"
import {elementAuth} from "../../../../utils/auth"
import spanWithStatus from "../../spanWithStatus"

const SettleIndexPage = ({location, dispatch, customer, selectCompany, customerSettle,
	loading, resource}) => {
	const { currentCustomer } = customer
	const {list} = customerSettle
	const createHandler = (values) => {
		dispatch({
			type: "customerSettle/create",
			payload: {
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerSettle/query"] || loading.effects["customerSettle/remove"]
	}
	const columns = [
		{
			title: "结算公司",
			dataIndex: "settleCompanyName",
			key: "settleCompanyName",
			render: (text, record) => spanWithStatus(text, record)
		}, {
			title: "生效时间",
			dataIndex: "effectTime",
			key: "effectTime"
		}
	]
	return (
		<div style={{marginTop: 16}}>
			<Table
				{...listProps}
				bordered
				pagination={false}
				columns={columns}
				scroll={{x: 320}}
				rowKey={record => record.id}
			/>
		</div>
	)
}

const mapStateToProps = ({customerSettle, customer, selectCompany, loading, resource}) =>
	({customerSettle, customer, selectCompany, loading, resource})

export default connect(mapStateToProps)(SettleIndexPage)
