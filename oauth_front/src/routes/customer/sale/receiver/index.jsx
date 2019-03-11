import React from "react"
import {connect} from "dva"
import {Button, Row, Table} from "antd"
import {elementAuth} from "../../../../utils/auth"
import FormModal from "./form"
import spanWithStatus from "../../spanWithStatus"

const IndexPage = ({location, dispatch, customer, selectEmployee,
										 customerReceiver, resource, loading}) => {
	const {list} = customerReceiver
	const {currentCustomer} = customer
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerReceiver/query"]
	}
	const createHandler = (values) => {
		dispatch({
			type: "customerReceiver/create",
			payload: {
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const columns = [
		{
			title: "收款客服",
			dataIndex: "receiverName",
			key: "receiverName",
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
					{elementAuth(location, "变更收款客服", resource.currentResources) && <FormModal
						title="变更收款客服"
						record={{customerCode: currentCustomer.customerCode}}
						selectEmployee={selectEmployee}
						onOk={createHandler}
						confirmLoading={loading.effects["customerReceiver/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">变更收款客服</Button>
					</FormModal>}
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

const mapStateToProps = ({customer, customerReceiver, selectEmployee, resource, loading}) =>
	({customer, customerReceiver, selectEmployee, resource, loading})

export default connect(mapStateToProps)(IndexPage)
