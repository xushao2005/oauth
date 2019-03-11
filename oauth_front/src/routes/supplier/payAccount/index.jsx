import React, {PureComponent} from "react"
import {connect} from "dva"
import {Button, Icon, Popconfirm, Row, Table} from "antd"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const mapStateToProps = ({supplierPayAccount, resource, loading}) =>
	({supplierPayAccount, resource, loading})

class IndexComponent extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}

	createHandler = (values) => {
		const {dispatch, supplierCode} = this.props
		dispatch({
			type: "supplierPayAccount/create",
			payload: {
				...values,
				supplierCode
			}
		})
	}
	updateHandler = (values) => {
		const {dispatch, supplierCode} = this.props
		dispatch({
			type: "supplierPayAccount/update",
			payload: {
				...values,
				supplierCode
			}
		})
	}
	handleDelete = (record) => {
		const {dispatch, supplierCode} = this.props
		dispatch({
			type: "supplierPayAccount/remove",
			payload: {
				id: record.payAccountId,
				supplierCode
			}
		})
	}

	render() {
		const {location, supplierPayAccount, resource, loading} = this.props
		const {list} = supplierPayAccount
		const listProps = {
			dataSource: list,
			pagination: false,
			loading: loading.effects["supplierPayAccount/query"]
		}
		const columns = [
			{
				title: "付款账户编码",
				dataIndex: "payAccountId",
				key: "payAccountId",
			}, {
				title: "付款账户名称",
				dataIndex: "accountName",
				key: "accountName",
			}, {
				title: "付款币种",
				dataIndex: "payCurrency",
				key: "payCurrency",
			}, {
				title: "操作",
				key: "action",
				width: 120,
				render: (text, record) => (
					<div className="operation">
						<span className="operationItem">
							{elementAuth(location, "编辑付款账号", resource.currentResources) && <FormModal
								title="编辑付款账号"
								onOk={this.updateHandler}
								entityId={record.payAccountId}
							>
								<Icon type="edit"/>编辑
							</FormModal>}
						</span>
						{elementAuth(location, "删除付款账号", resource.currentResources)
						&& <Popconfirm title="确定删除？" onConfirm={() => this.handleDelete(record)}>
							<span className="operationItem">
								<Icon title="删除" type="delete"/>
							</span>
						</Popconfirm>}
					</div>
				)
			}
		]
		return (
			<div className="content-inner">
				<Row>
					<div style={{textAlign: "right", marginBottom: 16}}>
						{elementAuth(location, "新增付款账号", resource.currentResources) && <FormModal
							title="新增付款账号"
							onOk={this.createHandler}
						>
							<Button size="large" type="primary">新增</Button>
						</FormModal>}
					</div>
				</Row>
				<Table
					{...listProps}
					bordered
					columns={columns}
					scroll={{x: 380}}
					rowKey={record => record.payAccountId}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(IndexComponent)
