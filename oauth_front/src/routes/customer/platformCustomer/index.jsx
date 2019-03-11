import React from "react"
import {connect} from "dva"
import {routerRedux} from "dva/router"
import {Table, Icon} from "antd"
import queryString from "query-string"
import AssociateModal from "./associateView"
import Filter from "./filter"
import {elementAuth} from "../../../utils/auth"

const platformCustomerIndex = ({platformCustomer, loading, location, dispatch, resource}) => {
	const {list, pagination, platforms, modal} = platformCustomer
	const filterProps = {
		filter: {
			...queryString.parse(location.search)
		},
		platforms,
		onFilterChange(fields) {
			dispatch(routerRedux.replace({
				pathname: location.pathname,
				search: queryString.stringify({
					...fields
				})
			}))
		}
	}
	const modalProps = {
		associateLoading: loading.effects["platformCustomer/associateBatch"],
		customerLoading: loading.effects["platformCustomer/searchSimilarCustomer"],
		pltfrmCustomerLoading: loading.effects["platformCustomer/searchSimilarPlatformCustomer"],
		loading: loading,
		data: modal,
		onCancel() {
			const {query, pathname} = location
			dispatch(routerRedux.replace({
				pathname: pathname,
				search: queryString.stringify({
					...query
				})
			}))
		}
	}
	const listProps = {
		dataSource: list,
		pagination,
		loading: loading.effects["platformCustomer/query"],
		onChange(_pagination) {
			const {query, pathname} = location
			dispatch(routerRedux.replace({
				pathname: pathname,
				search: queryString.stringify({
					...query,
					page: _pagination.current,
					pageSize: _pagination.pageSize
				})
			}))
		}
	}
	const columns = [
		{
			title: "来源平台",
			dataIndex: "sourceName",
			key: "sourceName",
			width: 80
		}, {
			title: "平台客户号",
			dataIndex: "transportCustomerCode",
			key: "transportCustomerCode"
		}, {
			title: "客户姓名",
			dataIndex: "name",
			key: "name"
		}, {
			title: "联系号码",
			dataIndex: "phone",
			key: "phone"
		}, {
			title: "省",
			dataIndex: "province",
			key: "province"
		}, {
			title: "市",
			dataIndex: "city",
			key: "city"
		}, {
			title: "区",
			dataIndex: "district",
			key: "district"
		}, {
			title: "详细地址",
			dataIndex: "streetAddress",
			key: "streetAddress",
			width: 150
		}, {
			title: "状态",
			dataIndex: "associateFlag",
			key: "associateFlag",
			render: status => (status ? "已通知" : "未通知"),
			width: 60
		}, {
			title: "操作",
			key: "action",
			width: 100,
			render: (text, record) => (
				<div className="operation" style={{display: "block"}}>
					<span className="operationItem">
						{elementAuth(location, "智能匹配", resource.currentResources) && <AssociateModal
							title="智能匹配"
							record={record}
							payload={record.phone}
							dispatch={dispatch}
							{...modalProps}
						>
							<Icon type="share-alt"/>智能匹配
						</AssociateModal>}
					</span>
				</div>
			)
		}]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 950}}
				rowKey={record => record.id}
			/>
		</div>
	)
}

const mapStateToProps = ({platformCustomer, loading, resource}) =>
	({platformCustomer, loading, resource})

export default connect(mapStateToProps)(platformCustomerIndex)
