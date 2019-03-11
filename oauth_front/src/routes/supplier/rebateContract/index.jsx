import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table, Popconfirm} from "antd"
import {elementAuth} from "../../../utils/auth"
import {fileApi} from "../../../constants/api"
import SupplierContractFormModal from "./form"

const ContractIndexPage = ({location, dispatch, supplier,
							   supplierRebateContract, selectRebateTypes, resource, loading}) => {
	const {list} = supplierRebateContract
	const {currentSupplier} = supplier
	const {rebateTypes} = selectRebateTypes
	const listProps = {
		dataSource: list,
		loading: loading.effects["supplierRebateContract/query"] || loading.effects["supplierRebateContract/remove"],
	}
	const createHandler = (values) => {
		dispatch({
			type: "supplierRebateContract/create",
			payload: {
				supplierCode: currentSupplier.code,
				...values
			}
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "supplierRebateContract/update",
			payload: {
				id,
				supplierCode: currentSupplier.code,
				...values
			}
		})
	}
	const handleDelete = (record) => {
		dispatch({
			type: "supplierRebateContract/remove",
			payload: {
				id: record.id,
				supplierCode: currentSupplier.code
			}
		})
	}
	const handleDownload = (record) => {
		const {contractAttach: url} = record
		window.open(`${fileApi.filePath}/${url}`, "top")
	}
	const columns = [
		{
			title: "合同编号",
			dataIndex: "contractCode",
			key: "contractCode"
		}, {
			title: "生效时间",
			dataIndex: "effectTime",
			key: "effectTime"
		}, {
			title: "失效时间",
			dataIndex: "invalidTime",
			key: "invalidTime"
		}, {
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime"
		}, {
			title: "返款形式",
			dataIndex: "rebateTypeName",
			key: "rebateTypeName"
		}, {
			title: "返款对象",
			dataIndex: "rebateTarget",
			key: "rebateTarget"
		}, {
			dataIndex: "contractAttachName",
			key: "contractAttachName",
			render: (text, record) => {
				if (record.contractAttach) {
					return (<span><a onClick={handleDownload.bind(null, record)}>下载合同</a></span>)
				} else {
					return (<span/>)
				}
			}
		}, {
			title: "操作",
			key: "operation",
			width: 120,
			render: (_, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑返款合同", resource.currentResources) && record.editable && <SupplierContractFormModal
							title="编辑合同"
							onOk={updateHandler.bind(null, record.id)}
							confirmLoading={loading.effects["supplierRebateContract/update"]}
							viewLoading={loading.effects["supplierRebateContract/view"]}
							dispatch={dispatch}
							record={record}
							payload={{id: record.id}}
							rebateTypes={rebateTypes}
						>
							<Icon type="edit"/>编辑
						</SupplierContractFormModal>}
					</span>
					{elementAuth(location, "删除返款合同", resource.currentResources) && <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
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
					{elementAuth(location, "新增返款合同", resource.currentResources) && <SupplierContractFormModal
						title="新增合同信息"
						record={{supplierCode: currentSupplier.code}}
						onOk={createHandler}
						confirmLoading={loading.effects["supplierRebateContract/create"]}
						dispatch={dispatch}
						rebateTypes={rebateTypes}
					>
						<Button size="large" type="primary">新增</Button>
					</SupplierContractFormModal>}
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

const mapStateToProps = ({supplier, supplierRebateContract,
							 selectRebateTypes, resource, loading}) =>
	({supplier, supplierRebateContract, selectRebateTypes, resource, loading})

export default connect(mapStateToProps)(ContractIndexPage)
