import React from "react"
import {connect} from "dva"
import {Button, Icon, Popconfirm, Row, Table} from "antd"
import {fileApi} from "../../../../constants/api"
import {elementAuth} from "../../../../utils/auth"
import CustomerContractFormModal from "./form"
import spanWithStatus from "../../spanWithStatus"

const SaleIndexPage = ({location, dispatch, customer, customerContract, resource, loading}) => {
	const {list} = customerContract
	const {currentCustomer} = customer
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerContract/query"]
	}
	const createHandler = (values) => {
		dispatch({
			type: "customerContract/create",
			payload: {
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "customerContract/update",
			payload: {
				id,
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const handleDelete = (record) => {
		dispatch({
			type: "customerContract/remove",
			payload: {
				id: record.id,
				customerCode: record.customerCode
			}
		})
	}
	const handleDownload = (record) => {
		const {contractAttatch: url} = record
		window.open(`${fileApi.filePath}/${url}`, "top")
	}
	const columns = [
		{
			title: "合同编号",
			dataIndex: "contractCode",
			key: "contractCode",
			render: (text, record) => spanWithStatus(text, record)
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
			dataIndex: "contractAttachName",
			key: "contractAttachName",
			render: (text, record) => {
				if (record.contractAttatch) {
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
					{elementAuth(location, "编辑合同", resource.currentResources)
					&& record.editable
					&& <CustomerContractFormModal
						title="编辑合同"
						record={record}
						onOk={updateHandler.bind(null, record.id)}
						confirmLoading={loading.effects["customerContract/update"]}
						dispatch={dispatch}
					>
						<span className="operationItem">
							<Icon type="edit"/>编辑
						</span>
					</CustomerContractFormModal>}
					{elementAuth(location, "删除合同", resource.currentResources)
					&& record.editable
					&& <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
						<span className="operationItem">
							<Icon type="delete"/>
						</span>
					</Popconfirm>}
				</div>
			)
		}
	]
	return (
		<div style={{marginTop: 16}}>
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增合同", resource.currentResources) && <CustomerContractFormModal
						title="新增合同"
						record={{customerCode: currentCustomer.customerCode}}
						onOk={createHandler}
						confirmLoading={loading.effects["customerContract/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增合同</Button>
					</CustomerContractFormModal>}
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

const mapStateToProps = ({customer, customerContract, resource, loading}) =>
	({customer, customerContract, resource, loading})

export default connect(mapStateToProps)(SaleIndexPage)
