import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table} from "antd"
import ProductTypeFormModal from "./form"
import {elementAuth} from "../../utils/auth"

const ProductTypeIndexPage = ({ location, dispatch, productType, resource, loading }) => {
	const {list, currentProductType} = productType
	const updateHandler = (id, values) => {
		dispatch({
			type: "productType/update",
			payload: {
				id,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "productType/create",
			payload: values
		})
	}
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["productType/query"] || loading.effects["productType/remove"],
		pagination: false
	}

	const columns = [
		{
			title: "产品类型编码",
			dataIndex: "id",
			key: "id",
		}, {
			title: "产品类型名称",
			dataIndex: "name",
			key: "name",
		}, {
			title: "操作",
			key: "action",
			width: 120,
			render: (text, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <ProductTypeFormModal
							title="编辑"
							onOk={updateHandler.bind(null, record.id)}
							record={currentProductType}
							payload={{id: record.id}}
							confirmLoading={loading.effects["productType/update"]}
							viewLoading={loading.effects["productType/view"]}
							dispatch={dispatch}
						>
							<Icon type="edit"/>编辑
						</ProductTypeFormModal>}
					</span>
				</div>
			)
		}
	]

	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <ProductTypeFormModal
						title="新增产品类型"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["productType/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</ProductTypeFormModal>}
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

const mapStateToProps = ({productType, resource, loading}) =>
	({productType, resource, loading})

export default connect(mapStateToProps)(ProductTypeIndexPage)
