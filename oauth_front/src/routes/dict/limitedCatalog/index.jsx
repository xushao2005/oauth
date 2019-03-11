import React from "react"
import {connect} from "dva"
import {Table, Icon, Row, Button} from "antd"
import LimitedCatalogModal from "./form"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({dispatch, location, limitedCatalog, resource, loading}) => {
	const {list} = limitedCatalog
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["limitedCatalog/query"],
		pagination: false
	}
	const updateHandler = (ikey, values) => {
		dispatch({
			type: "limitedCatalog/update",
			payload: {
				ikey,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "limitedCatalog/create",
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
						{elementAuth(location, "编辑", resource.currentResources) && <LimitedCatalogModal
							title="编辑"
							record={record}
							onOk={updateHandler.bind(null, record.ikey)}
							confirmLoading={loading.effects["limitedCatalog/update"]}
							dispatch={dispatch}
							payload={{ikey: record.ikey}}
						>
							<Icon type="edit"/>编辑
						</LimitedCatalogModal>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <LimitedCatalogModal
						title="新增限制级类目"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["limitedCatalog/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</LimitedCatalogModal>}
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

const mapStateToProps = ({limitedCatalog, resource, loading}) =>
	({limitedCatalog, resource, loading})

export default connect(mapStateToProps)(IndexPage)

