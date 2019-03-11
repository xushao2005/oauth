import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table} from "antd"
import ChinaPostTypeFormModal from "./form"
import {elementAuth} from "../../utils/auth"

const ChinaPostTypeIndexPage = ({ location, dispatch, chinaPostType, resource, loading }) => {
	const {list} = chinaPostType
	const updateHandler = (id, values) => {
		dispatch({
			type: "chinaPostType/update",
			payload: {
				id,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "chinaPostType/create",
			payload: values
		})
	}
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["chinaPostType/query"],
		pagination: false
	}

	const columns = [
		{
			title: "中邮类型编码",
			dataIndex: "id",
			key: "id",
		}, {
			title: "中邮类型名称",
			dataIndex: "name",
			key: "name",
		}, {
			title: "操作",
			key: "action",
			width: 120,
			render: (text, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <ChinaPostTypeFormModal
							title="编辑"
							onOk={updateHandler.bind(null, record.id)}
							confirmLoading={loading.effects["chinaPostType/update"]}
							record={record}
							dispatch={dispatch}
							payload={{id: record.id}}
						>
							<Icon type="edit"/>编辑
						</ChinaPostTypeFormModal>}
					</span>
				</div>
			)
		}
	]

	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <ChinaPostTypeFormModal
						title="新增中邮类型"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["chinaPostType/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</ChinaPostTypeFormModal>}
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

const mapStateToProps = ({chinaPostType, resource, loading}) =>
	({chinaPostType, resource, loading})

export default connect(mapStateToProps)(ChinaPostTypeIndexPage)
