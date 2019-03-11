import React from "react"
import {connect} from "dva"
import {Table} from "antd"

const CustomerLogIndexPage = ({customerLog, loading}) => {
	const {list} = customerLog
	const listProps = {
		dataSource: list,
		loading: loading.effects["customerLog/query"]
	}
	const columns = [{
		title: "操作者",
		dataIndex: "operateId",
		key: "operateId",
	}, {
		title: "操作类型",
		dataIndex: "operation",
		key: "operation"
	}, {
		title: "操作时间",
		dataIndex: "createTime",
		key: "createTime"
	}, {
		title: "推送时间",
		dataIndex: "modifyTime",
		key: "modifyTime"
	}]
	const expandedRowRender = (record) => {
		if ((typeof (record.diffs) !== "undefined") && (typeof (record.diffs) === "object")) {
			const expandData = []
			record.diffs.forEach((it) => {
				expandData.push(
					{
						attrName: it.attrName,
						oldValue: it.oldValue,
						newValue: it.newValue,
					}
				)
			})
			const expendColumns = [
				{
					title: "属性",
					dataIndex: "attrName",
					key: "attrName",
					width: 150
				}, {
					title: "旧值",
					dataIndex: "oldValue",
					key: "oldValue",
					width: 150,
					// render: (it) => {
					// 	if (it.attrValue === "payCycle") {
					// 		return PAY_CYCLE_CONSTANTS.get(it.oldValue)
					// 	}
					// 	return it.oldValue
					// }
				}, {
					title: "新值",
					dataIndex: "newValue",
					key: "newValue",
					width: 150,
					// render: (it) => {
					// 	if (it.attrValue === "payCycle") {
					// 		return PAY_CYCLE_CONSTANTS.get(it.newValue)
					// 	}
					// 	return it.newValue
					// }
				}
			]
			return (
				<Table
					columns={expendColumns}
					dataSource={expandData}
					size="middle"
					pagination={false}
					title={() => `${record.operation}(id: ${record.id})`}
					scroll={{x: 800}}
				/>
			)
		} else {
			return (
				<pre>
					{record.diffs}
				</pre>
			)
		}
	}
	return (
		<div style={{marginTop: 16, marginBottom: 18}}>
			<Table
				{...listProps}
				columns={columns}
				bordered
				defaultExpandAllRows
				expandedRowRender={expandedRowRender}
				pagination={false}
				scroll={{x: 900}}
				rowKey={record => record.id}
			/>
		</div>
	)
}

const mapStateToProps = ({customerLog, loading}) => ({customerLog, loading})
export default connect(mapStateToProps)(CustomerLogIndexPage)
