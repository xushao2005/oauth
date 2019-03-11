import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table} from "antd"
import TransportFormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({ location, dispatch, transportMode, resource, loading }) => {
	const {list} = transportMode
	const updateHandler = (ikey, values) => {
		dispatch({
			type: "transportMode/update",
			payload: {
				ikey,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "transportMode/create",
			payload: values
		})
	}
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["transportMode/query"],
		pagination: false
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
						{elementAuth(location, "编辑", resource.currentResources) && <TransportFormModal
							title="编辑"
							record={record}
							onOk={updateHandler.bind(null, record.ikey)}
							confirmLoading={loading.effects["transportMode/update"]}
							viewLoading={loading.effects["transportMode/view"]}
							dispatch={dispatch}
							payload={{ikey: record.ikey}}
						>
							<Icon type="edit"/>编辑
						</TransportFormModal>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <TransportFormModal
						title="新增运输方式"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["transportMode/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</TransportFormModal>}
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

const mapStateToProps = ({transportMode, resource, loading}) =>
	({transportMode, resource, loading})

export default connect(mapStateToProps)(IndexPage)
