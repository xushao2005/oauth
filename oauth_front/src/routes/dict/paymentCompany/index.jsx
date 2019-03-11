import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table} from "antd"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({ location, dispatch, paymentCompany, resource, loading }) => {
	const {list} = paymentCompany
	const updateHandler = (id, values) => {
		dispatch({
			type: "paymentCompany/update",
			payload: {
				id,
				...values
			}
		})
	}
	const createHandler = (values) => {
		dispatch({
			type: "paymentCompany/create",
			payload: values
		})
	}
	// 表单参数
	const listProps = {
		dataSource: list,
		loading: loading.effects["paymentCompany/query"],
		pagination: false
	}

	const columns = [
		{
			title: "编码",
			dataIndex: "id",
			key: "id",
		}, {
			title: "名称",
			dataIndex: "name",
			key: "name",
		}, {
			title: "操作",
			key: "action",
			width: 120,
			render: (text, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <FormModal
							title="编辑"
							record={record}
							onOk={updateHandler.bind(null, record.id)}
							confirmLoading={loading.effects["paymentCompany/update"]}
							viewLoading={loading.effects["paymentCompany/view"]}
							dispatch={dispatch}
							payload={{id: record.id}}
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
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <FormModal
						title="新增付款公司"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["paymentCompany/create"]}
						dispatch={dispatch}
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

const mapStateToProps = ({paymentCompany, resource, loading}) =>
	({paymentCompany, resource, loading})

export default connect(mapStateToProps)(IndexPage)
