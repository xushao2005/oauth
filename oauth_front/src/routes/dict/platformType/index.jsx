import React, {PureComponent} from "react"
import {connect} from "dva"
import {Button, Row, Table, Icon} from "antd"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const mapStateToProps = ({platformType, resource, loading}) =>
	({platformType, resource, loading})

class IndexComponent extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}
	createHandler = (values) => {
		const {dispatch} = this.props
		dispatch({
			type: "platformType/create",
			payload: values
		})
	}
	updateHandler = (values) => {
		const {dispatch} = this.props
		dispatch({
			type: "platformType/update",
			payload: values
		})
	}

	render() {
		const {location, platformType, resource, loading} = this.props
		const {list} = platformType
		const listProps = {
			dataSource: list,
			pagination: false,
			loading: loading.effects["platformType/query"]
		}
		const columns = [
			{
				title: "编码",
				dataIndex: "ikey",
				key: "iKey",
			}, {
				title: "名称",
				dataIndex: "value",
				key: "value",
			}, {
				title: "操作",
				key: "action",
				width: 120,
				render: (text, record) => (
					<div className="operation">
						<span className="operationItem">
							{elementAuth(location, "编辑", resource.currentResources) && <FormModal
								title="编辑平台类型"
								onOk={this.updateHandler}
								entityId={record.ikey}
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
							title="新增平台类型"
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
					rowKey={record => record.ikey}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(IndexComponent)
