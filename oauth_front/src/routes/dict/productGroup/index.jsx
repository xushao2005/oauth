import React from "react"
import {connect} from "dva"
import {Table, Icon, Row, Button} from "antd"
import ProductGroupModal from "./form"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({dispatch, location, productGroup, resource, loading}) => {
	const {list} = productGroup
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["productGroup/query"],
		pagination: false
	}
	const updateHandler = (ikey, values) => {
		dispatch({
			type: "productGroup/update",
			payload: {
				ikey,
				...values
			}
		})
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
						{elementAuth(location, "编辑", resource.currentResources) && <ProductGroupModal
							title="编辑"
							record={record}
							onOk={updateHandler.bind(null, record.ikey)}
							confirmLoading={loading.effects["productGroup/update"]}
							viewLoading={loading.effects["productGroup/view"]}
							dispatch={dispatch}
							payload={{ikey: record.ikey}}
						>
							<Icon type="edit"/>编辑
						</ProductGroupModal>}
					</span>
				</div>
			)
		}
	]
	const createHandler = (values) => {
		dispatch({
			type: "productGroup/create",
			payload: values
		})
	}
	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <ProductGroupModal
						title="新增产品组"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["productGroup/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</ProductGroupModal>}
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

const mapStateToProps = ({productGroup, resource, loading}) =>
	({productGroup, resource, loading})

export default connect(mapStateToProps)(IndexPage)
