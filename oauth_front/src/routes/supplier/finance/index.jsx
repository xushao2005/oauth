import React from "react"
import {connect} from "dva"
import {Button, Icon, Popconfirm, Row, Table} from "antd"
import {elementAuth} from "../../../utils/auth"
import SupplierFinanceFormModal from "./form"

const FinanceIndexPage = ({location, dispatch, supplier, supplierFinance, resource, loading}) => {
	const {list} = supplierFinance
	const {currentSupplier} = supplier
	const listProps = {
		dataSource: list,
		loading: loading.effects["supplierFinance/query"] || loading.effects["supplierFinance/remove"]
	}
	const createHandler = (values) => {
		dispatch({
			type: "supplierFinance/create",
			payload: {
				supplierCode: currentSupplier.code,
				...values
			}
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "supplierFinance/update",
			payload: {
				id,
				supplierCode: currentSupplier.code,
				...values
			}
		})
	}
	const handleDelete = (record) => {
		dispatch({
			type: "supplierFinance/remove",
			payload: {
				id: record.id,
				supplierCode: currentSupplier.code
			}
		})
	}
	const columns = [
		{
			title: "银行户名",
			dataIndex: "name",
			key: "name"
		}, {
			title: "银行账号",
			dataIndex: "accountNumber",
			key: "accountNumber"
		}, {
			title: "开户行",
			dataIndex: "bankName",
			key: "bankName"
		}, {
			title: "创建时间",
			dataIndex: "addTime",
			key: "addTime"
		}, {
			title: "操作",
			key: "operation",
			width: 120,
			render: (_, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑银行账号", resource.currentResources) && <SupplierFinanceFormModal
							title="编辑"
							onOk={updateHandler.bind(null, record.id)}
							confirmLoading={loading.effects["supplierFinance/update"]}
							viewLoading={loading.effects["supplierFinance/view"]}
							dispatch={dispatch}
							record={record}
							payload={{id: record.id}}
						>
							<Icon type="edit"/>编辑
						</SupplierFinanceFormModal>}
					</span>
					{elementAuth(location, "删除银行账号", resource.currentResources) &&
					<Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
						<span className="operationItem">
							<Icon title="删除" type="delete"/>
						</span>
					</Popconfirm>}
				</div>
			)
		}
	]
	return (
		<div>
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增银行账号", resource.currentResources) && <SupplierFinanceFormModal
						title="新增银行账号"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["supplierFinance/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</SupplierFinanceFormModal>}
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

const mapStateToProps = ({supplier, supplierFinance, resource, loading}) =>
	({supplier, supplierFinance, resource, loading})

export default connect(mapStateToProps)(FinanceIndexPage)
