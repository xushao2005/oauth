import React from "react"
import {connect} from "dva"
import {Button, Icon, Popconfirm, Row, Table} from "antd"
import {elementAuth} from "../../../utils/auth"
import SupplierContactFormModal from "./form"


const ContactIndexPage = ({location, dispatch, supplier, supplierContact, resource, loading}) => {
	const {list} = supplierContact
	const {currentSupplier} = supplier
	const listProps = {
		dataSource: list,
		loading: loading.effects["supplierContact/query"] || loading.effects["supplierContact/remove"],
	}
	const createHandler = (values) => {
		dispatch({
			type: "supplierContact/create",
			payload: {
				supplierCode: currentSupplier.code,
				...values
			}
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "supplierContact/update",
			payload: {
				id,
				supplierCode: currentSupplier.code,
				...values
			}
		})
	}
	const handleDelete = (record) => {
		dispatch({
			type: "supplierContact/remove",
			payload: {
				id: record.id,
				supplierCode: record.supplierCode
			}
		})
	}
	const columns = [
		{
			title: "联系人",
			dataIndex: "contactName",
			key: "contactName"
		}, {
			title: "职称",
			dataIndex: "professionalTitle",
			key: "professionalTitle"
		}, {
			title: "联系电话",
			dataIndex: "contactPhone",
			key: "contactPhone"
		}, {
			title: "QQ",
			dataIndex: "qq",
			key: "qq"
		}, {
			title: "Email",
			dataIndex: "email",
			key: "email"
		}, {
			title: "操作",
			key: "operation",
			width: 120,
			render: (_, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑联系人", resource.currentResources) && <SupplierContactFormModal
							title="编辑"
							onOk={updateHandler.bind(null, record.id)}
							confirmLoading={loading.effects["supplierContact/update"]}
							viewLoading={loading.effects["supplierContact/view"]}
							dispatch={dispatch}
							record={record}
							payload={{id: record.id}}
						>
							<Icon type="edit"/>编辑
						</SupplierContactFormModal>}
					</span>
					{elementAuth(location, "删除联系人", resource.currentResources) && <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
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
					{elementAuth(location, "新增联系人", resource.currentResources) && <SupplierContactFormModal
						title="新增联系人"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["supplierContact/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</SupplierContactFormModal>}
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

const mapStateToProps = ({supplier, supplierContact, resource, loading}) =>
	({supplier, supplierContact, resource, loading})

export default connect(mapStateToProps)(ContactIndexPage)
