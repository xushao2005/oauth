import React from "react"
import {connect} from "dva"
import {Button, Icon, Popconfirm, Row, Table} from "antd"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const PlatformIndexPage =
	({location, dispatch, customer, customerPlatform, resource, loading}) => {
		const {list, pagination} = customerPlatform
		const {currentCustomer} = customer
		const listProps = {
			dataSource: list,
			pagination,
			loading: loading.effects["customerPlatform/query"] || loading.effects["customerPlatform/remove"],
			onChange (page) {
				dispatch({
					type: "customerPlatform/query",
					payload: {
						customerCode: currentCustomer.customerCode,
						query: {
							page: page.current,
							pageSize: page.pageSize
						}
					}
				})
			}
		}
		const createHandler = (values) => {
			dispatch({
				type: "customerPlatform/create",
				payload: {
					customerCode: currentCustomer.customerCode,
					...values
				}
			})
		}
		const updateHandler = (id, values) => {
			dispatch({
				type: "customerPlatform/update",
				payload: {
					id,
					customerCode: currentCustomer.customerCode,
					...values
				}
			})
		}
		const handleDelete = (record) => {
			dispatch({
				type: "customerPlatform/remove",
				payload: {
					id: record.id,
					customerCode: currentCustomer.customerCode
				}
			})
		}
		const columns = [
			{
				title: "销售平台",
				dataIndex: "customerPlamName",
				key: "customerPlamName"
			}, {
				title: "平台客户号",
				dataIndex: "plamCode",
				key: "plamCode"
			}, {
				title: "创建时间",
				dataIndex: "createTime",
				key: "createTime"
			}, {
				title: "操作",
				key: "operation",
				width: 120,
				render: (_, record) => (
					<div className="operation">
						{elementAuth(location, "编辑销售平台", resource.currentResources) && <FormModal
							title="编辑销售平台"
							record={record}
							confirmLoading={loading.effects["customerPlatform/update"]}
							onOk={updateHandler.bind(null, record.id)}
						>
							<span className="operationItem">
								<Icon type="edit"/>编辑
							</span>
						</FormModal>}
						{elementAuth(location, "删除销售平台", resource.currentResources) && <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
							<span className="operationItem">
								<Icon type="delete"/>
							</span>
						</Popconfirm>}
					</div>
				)
			}
		]
		return (
			<div style={{marginTop: 16, marginBottom: 18}}>
				<Row>
					<div style={{textAlign: "right", marginBottom: 16}}>
						{elementAuth(location, "新增销售平台", resource.currentResources) && <FormModal
							title="新增销售平台"
							record={{}}
							confirmLoading={loading.effects["customerPlatform/create"]}
							onOk={createHandler}
						>
							<Button size="large" type="primary">新增销售平台</Button>
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

const mapStateToProps = ({customerPlatform, customer, resource, loading}) =>
	({customerPlatform, customer, resource, loading})

export default connect(mapStateToProps)(PlatformIndexPage)
