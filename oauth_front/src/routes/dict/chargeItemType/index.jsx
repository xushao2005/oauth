import React, {PureComponent} from "react"
import {connect} from "dva"
import {Button, Row, Table, Icon} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import billType from "../../../constants/billType"
import chargeType from "../../../constants/chargeType"
import Filter from "./filter"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const mapStateToProps = ({chargeItemType, resource, loading}) =>
	({chargeItemType, resource, loading})

class IndexComponent extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}
	createHandler = (values) => {
		const {dispatch} = this.props
		dispatch({
			type: "chargeItemType/create",
			payload: values
		})
	}
	updateHandler = (values) => {
		if (values.code === "N") {
			values.code = "-1"
		}
		const {dispatch} = this.props
		dispatch({
			type: "chargeItemType/update",
			payload: values
		})
	}

	render() {
		const {dispatch, location, chargeItemType, resource, loading} = this.props
		const {list, pagination} = chargeItemType
		const filterProps = {
			dispatch,
			filter: {
				...queryString.parse(location.search)
			},
			onFilterChange(fields) {
				dispatch(routerRedux.replace({
					pathname: location.pathname,
					search: queryString.stringify({
						...fields
					})
				}))
			}
		}
		const listProps = {
			dataSource: list,
			pagination,
			loading: loading.effects["chargeItemType/query"],
			onChange(p) {
				const {query, pathname} = location
				dispatch(routerRedux.replace({
					pathname: pathname,
					search: queryString.stringify({
						...query,
						page: p.current,
						pageSize: p.pageSize
					})
				}))
			}
		}
		const columns = [
			{
				title: "计费项类型编号",
				dataIndex: "code",
				key: "code",
			}, {
				title: "计费项类型名称",
				dataIndex: "name",
				key: "name",
			}, {
				title: "单号类型",
				dataIndex: "billType",
				key: "billType",
				render: text => (
					billType.get(text)
				)
			}, {
				title: "费用类型",
				dataIndex: "type",
				key: "type",
				render: text => (
					chargeType.get(text)
				)
			}, {
				title: "操作",
				key: "action",
				width: 120,
				render: (text, record) => (
					<div className="operation">
						<span className="operationItem">
							{elementAuth(location, "编辑", resource.currentResources) && <FormModal
								title="编辑计费项类型"
								onOk={this.updateHandler}
								entityId={record.code}
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
				<Filter {...filterProps}/>
				<Row>
					<div style={{textAlign: "right", marginBottom: 16}}>
						{elementAuth(location, "新增", resource.currentResources) && <FormModal
							title="新增计费项类型"
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
					scroll={{x: 500}}
					rowKey={record => record.code}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(IndexComponent)
