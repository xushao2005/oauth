import React, {PureComponent} from "react"
import {connect} from "dva"
import {Button, Row, Table, Icon} from "antd"
import FormModal from "./form"
import {elementAuth} from "../../utils/auth"

const mapStateToProps = ({currency, resource, loading}) =>
	({currency, resource, loading})

class IndexComponent extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}
	createHandler = (values) => {
		const {dispatch} = this.props
		dispatch({
			type: "currency/create",
			payload: values
		})
	}
	updateHandler = (values) => {
		const {dispatch} = this.props
		dispatch({
			type: "currency/update",
			payload: values
		})
	}

	render() {
		const {location, currency, resource, loading} = this.props
		const {list} = currency
		const listProps = {
			dataSource: list,
			pagination: false,
			loading: loading.effects["currency/query"]
		}
		const columns = [
			{
				title: "编码",
				dataIndex: "id",
				key: "id",
			}, {
				title: "币种",
				dataIndex: "name",
				key: "name",
			}, {
				title: "描述",
				dataIndex: "description",
				key: "description",
			}, {
				title: "货币符号",
				dataIndex: "symbol",
				key: "symbol",
			}, {
				title: "操作",
				key: "action",
				width: 120,
				render: (text, record) => (
					<div className="operation">
						<span className="operationItem">
							{elementAuth(location, "编辑", resource.currentResources) && <FormModal
								title="编辑币种"
								onOk={this.updateHandler}
								entityId={record.id}
								record={record}
							>
								<Icon type="edit"/>编辑
							</FormModal>}
						</span>
					</div>
				)
			}
		]
		return (
			<div className="content-inner">
				<Row>
					<div style={{textAlign: "right", marginBottom: 16}}>
						{elementAuth(location, "新增", resource.currentResources) && <FormModal
							title="新增币种"
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
					scroll={{x: 320}}
					rowKey={record => record.id}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(IndexComponent)
