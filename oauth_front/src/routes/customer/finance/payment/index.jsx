import React from "react"
import {connect} from "dva"
import {Table, Icon, Row, Button, Popconfirm} from "antd"
import PaymentFormModal from "./form"
import {elementAuth} from "../../../../utils/auth"

const PaymentIndexPage = ({location, dispatch, customer, customerPayment, selectBank,
							  resource, loading}) => {
	const {list} = customerPayment
	const {currentCustomer} = customer
	const {banks: bankSelection} = selectBank
	const createHandler = (values) => {
		dispatch({
			type: "customerPayment/create",
			payload: {
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "customerPayment/update",
			payload: {
				id,
				customerCode: currentCustomer.customerCode,
				...values
			}
		})
	}
	const handleDelete = (record) => {
		dispatch({
			type: "customerPayment/remove",
			payload: {
				id: record.id,
				customerCode: currentCustomer.customerCode,
			}
		})
	}
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerPayment/query"] || loading.effects["customerPayment/remove"]
	}
	const columns = [
		{
			title: "付款方式",
			dataIndex: "paymentDesc",
			key: "payment"
		}, {
			title: "银行卡号/付款账号",
			dataIndex: "bankCard",
			key: "bankCard"
		}, {
			title: "姓名",
			dataIndex: "bankAccount",
			key: "bankAccount"
		}, {
			title: "银行",
			dataIndex: "bankName",
			key: "bankName"
		}, {
			title: "是否默认",
			dataIndex: "defaultPay",
			key: "defaultPay",
			render: it => (it ? "是" : "否")
		}, {
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime"
		}, {
			title: "操作",
			key: "operation",
			width: 120,
			render: (_, record) => (
				<div className="operation">
					{elementAuth(location, "编辑付款方式", resource.currentResources) && <PaymentFormModal
						title="编辑付款方式"
						record={record}
						confirmLoading={loading.effects["customerPayment/update"]}
						onOk={updateHandler.bind(null, record.id)}
						customerCode={currentCustomer.customerCode}
						bankSelection={bankSelection}
					>
						<span className="operationItem">
							<Icon type="edit"/>编辑
						</span>
					</PaymentFormModal>}
					{elementAuth(location, "删除付款方式", resource.currentResources) && <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
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
			<Row>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增付款方式", resource.currentResources) && <PaymentFormModal
						title="新增付款方式"
						record={{}}
						confirmLoading={loading.effects["customerPayment/create"]}
						onOk={createHandler}
						customerCode={currentCustomer.customerCode}
						bankSelection={bankSelection}
					>
						<Button size="large" type="primary">新增付款方式</Button>
					</PaymentFormModal>}
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

const mapStateToProps = ({customer, customerPayment, selectBank, resource, loading}) =>
	({customer, customerPayment, selectBank, resource, loading})

export default connect(mapStateToProps)(PaymentIndexPage)
