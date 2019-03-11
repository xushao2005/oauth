import React from "react"
import {connect} from "dva"
import {Table, Icon, Row, Button} from "antd"
import SaleProductTypeModal from "./form"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({dispatch, location, saleProductType, resource, loading}) => {
	const {list} = saleProductType
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["saleProductType/query"],
		pagination: false
	}
	const updateHandler = (ikey, values) => {
		dispatch({
			type: "saleProductType/update",
			payload: {
				ikey,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "saleProductType/create",
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
						{elementAuth(location, "编辑", resource.currentResources) && <SaleProductTypeModal
							title="编辑"
							record={record}
							onOk={updateHandler.bind(null, record.ikey)}
							confirmLoading={loading.effects["saleProductType/update"]}
							viewLoading={loading.effects["saleProductType/view"]}
							dispatch={dispatch}
							payload={{ikey: record.ikey}}
						>
							<Icon type="edit"/>编辑
						</SaleProductTypeModal>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <SaleProductTypeModal
						title="新增销售产品类型"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["saleProductType/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</SaleProductTypeModal>}
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

const mapStateToProps = ({saleProductType, resource, loading}) =>
	({saleProductType, resource, loading})

export default connect(mapStateToProps)(IndexPage)

