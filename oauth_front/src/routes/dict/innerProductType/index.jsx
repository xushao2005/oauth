import React from "react"
import {connect} from "dva"
import {Table, Icon, Row, Button} from "antd"
import InnerProductTypeModal from "./form"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({dispatch, location, innerProductType, resource, loading}) => {
	const {list} = innerProductType
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["innerProductType/query"],
		pagination: false
	}
	const updateHandler = (ikey, values) => {
		dispatch({
			type: "innerProductType/update",
			payload: {
				ikey,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "innerProductType/create",
			payload: values
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
						{elementAuth(location, "编辑", resource.currentResources) && <InnerProductTypeModal
							title="编辑"
							record={record}
							onOk={updateHandler.bind(null, record.ikey)}
							confirmLoading={loading.effects["innerProductType/update"]}
							dispatch={dispatch}
							payload={{ikey: record.ikey}}
						>
							<Icon type="edit"/>编辑
						</InnerProductTypeModal>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <InnerProductTypeModal
						title="新增内部产品类型"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["innerProductType/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</InnerProductTypeModal>}
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

const mapStateToProps = ({innerProductType, resource, loading}) =>
	({innerProductType, resource, loading})

export default connect(mapStateToProps)(IndexPage)

