import React from "react"
import {connect} from "dva"
import {Button, Row, Table} from "antd"
import {elementAuth} from "../../../../utils/auth"
import spanWithStatus from "../../spanWithStatus"
import CustomerSalesFormModal from "./form"

const IndexPage = ({
										 location, dispatch, customer, selectEmployee,
										 customerSales, resource, loading
									 }) => {
	const {list} = customerSales
	const {currentCustomer} = customer
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerSales/query"]
	}
	const createHandler = (values) => {
		dispatch({
			type: "customerSales/create",
			payload: {
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const columns = [
		{
			title: "销售经理",
			dataIndex: "salesManagerName",
			key: "salesManagerName",
			render: (text, record) => spanWithStatus(text, record)
		}, {
			title: "生效时间",
			dataIndex: "effectTime",
			key: "effectTime"
		}
	]
	return (
		<div style={{marginTop: 16}}>
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "变更销售经理", resource.currentResources) && <CustomerSalesFormModal
						title="变更销售经理"
						record={{customerCode: currentCustomer.customerCode}}
						selectEmployee={selectEmployee}
						onOk={createHandler}
						confirmLoading={loading.effects["customerSales/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">变更销售经理</Button>
					</CustomerSalesFormModal>}
				</div>
			</Row>
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

const mapStateToProps = ({customer, customerSales, selectEmployee, resource, loading}) =>
	({customer, customerSales, selectEmployee, resource, loading})

export default connect(mapStateToProps)(IndexPage)
