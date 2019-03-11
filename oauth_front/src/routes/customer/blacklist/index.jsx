import React from "react"
import {connect} from "dva"
import { Row, Button, Table, Icon, Popconfirm } from "antd"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const blackListIndexPage =
({location, dispatch, customerBlacklist, customer,
	selectProduct, selectRegion, resource, loading}) => {
	const {currentCustomer} = customer
	const {list} = customerBlacklist
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerBlacklist/query"]
	}
	const handleDelete = (record) => {
		dispatch({
			type: "customerBlacklist/remove",
			payload: {
				id: record.id,
				customerCode: currentCustomer.customerCode
			}
		})
	}
	const columns = [{
		title: "产品",
		dataIndex: "productName",
		key: "productName",
		width: 400,
	}, {
		title: "国家",
		dataIndex: "forbiddenAllCountries",
		key: "forbiddenAllCountries",
		render: (text, record) => <span>{text ? "全部国家" : record.countries}</span>
	}, {
		title: "编辑",
		dataIndex: "edit",
		key: "edit",
		width: 120,
		render: (_, record) => (
			<div className="operation">
				{elementAuth(location, "编辑产品黑名单", resource.currentResources) && <FormModal
					title="编辑产品黑名单"
					confirmLoading={loading.effects["customerBlacklist/update"] && loading.effects["customerBlacklist/view"]}
					record={record}
					selectProduct={selectProduct}
					selectRegion={selectRegion}
					customer={customer}
					dispatch={dispatch}
				>
					<span className="operationItem">
						<Icon type="edit"/>编辑
					</span>
				</FormModal>}
				{elementAuth(location, "删除产品黑名单", resource.currentResources) && <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
					<span className="operationItem">
						<Icon type="delete"/>
					</span>
				</Popconfirm>}
			</div>
		)
	}]
	return (
		<div style={{marginTop: 16, marginBottom: 18}}>
			<Row>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增产品黑名单", resource.currentResources) && <FormModal
						title="新增产品黑名单"
						confirmLoading={loading.effects["customerBlacklist/create"]}
						record={{}}
						selectProduct={selectProduct}
						selectRegion={selectRegion}
						customer={customer}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增产品黑名单</Button>
					</FormModal>}
				</div>
			</Row>
			<Table
				{...listProps}
				columns={columns}
				bordered
				pagination={false}
				rowKey={record => record.productCode}
			/>
		</div>
	)
}

const mapStateToProps = ({customerBlacklist, customer,
	selectProduct, selectRegion, resource, loading}) =>
	({customerBlacklist, customer, selectProduct, selectRegion, resource, loading})

export default connect(mapStateToProps)(blackListIndexPage)
