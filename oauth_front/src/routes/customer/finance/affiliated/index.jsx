import React from "react"
import {connect} from "dva"
import {Table, Row, Button} from "antd"
import AffiliatedFormModal from "./form"
import {elementAuth} from "../../../../utils/auth"
import spanWithStatus from "../../spanWithStatus"

const AffiliatedIndexPage = ({location, dispatch, customer, customerAffiliated,
	selectCompany, loading, resource}) => {
	const {list} = customerAffiliated
	const {currentCustomer} = customer
	const createHandler = (values) => {
		dispatch({
			type: "customerAffiliated/create",
			payload: {
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
		dispatch({
			type: "customerSettle/query",
			payload: {
				customerCode: currentCustomer.customerCode,
			}
		})
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerAffiliated/query"] || loading.effects["customerAffiliated/remove"]
	}
	const columns = [
		{
			title: "所属公司",
			dataIndex: "affiliatedCompanyName",
			key: "affiliatedCompanyName",
			render: (text, record) => spanWithStatus(text, record)
		}, {
			title: "生效时间",
			dataIndex: "effectTime",
			key: "effectTime"
		}
	]
	return (
		<div>
			<Row>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "变更所属公司", resource.currentResources) && <AffiliatedFormModal
						title="变更所属公司"
						record={{customerCode: currentCustomer.customerCode}}
						confirmLoading={loading.effects["customerAffiliated/create"]}
						onOk={createHandler}
						selectCompany={selectCompany}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">变更所属公司</Button>
					</AffiliatedFormModal>}
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

const mapStateToProps = ({customer, customerAffiliated, selectCompany, loading, resource}) =>
	({customer, customerAffiliated, selectCompany, loading, resource})

export default connect(mapStateToProps)(AffiliatedIndexPage)
