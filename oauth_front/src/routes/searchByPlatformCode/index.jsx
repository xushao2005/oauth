import React from "react"
import {connect} from "dva"
import {Table, Icon} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import Filter from "./filter"
import CustomerViewModal from "../customer/tabView"
import {styles} from "../../components/layouts"

const IndexPage = ({location, dispatch, resource, loading, customer, searchByPlatformCode}) => {
	const {query, pathname} = location
	const {list, pagination} = searchByPlatformCode
	const {editable, currentTab, mainTab} = customer
	const updateHandler = (customerCode, values) => {
		dispatch({
			type: "customer/update",
			payload: {
				customerCode,
				...values,
				query: queryString.parse(location.search)
			}
		})
	}
	const filterProps = {
		onFilterChange(fields) {
			dispatch(routerRedux.replace({
				pathname: location.pathname,
				search: queryString.stringify({
					...fields
				})
			}))
		}
	}
	const columns = [{
		title: "平台客户号",
		dataIndex: "plamCode",
		key: "plamCode",
		width: 120
	}, {
		title: "平台类型",
		dataIndex: "customerPlamName",
		key: "customerPlamName",
		width: 80
	}, {
		title: "客户号",
		dataIndex: "customerCode",
		key: "customerCode",
		width: 88
	}, {
		title: "客户名称",
		dataIndex: "customerName",
		key: "customerName",
		width: 200,
		render: (text, record) => (
			<CustomerViewModal
				title={`客户号: ${record.customerCode}`}
				dispatch={dispatch}
				viewLoading={loading.effects["customer/view"]}
				updateLoading={loading.effects["customer/update"]}
				payload={{customerCode: record.customerCode}}
				location={location}
				editable={editable}
				customer={customer}
				resource={resource}
				currentTab={currentTab}
				mainTab={mainTab}
				onOk={updateHandler.bind(null, record.customerCode)}
			>
				<div className={styles.view}>
					<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
				</div>
			</CustomerViewModal>
		)
	}, {
		title: "联系人",
		dataIndex: "contactName",
		key: "contactName",
		width: 80
	}, {
		title: "联系电话",
		dataIndex: "contactPhone",
		key: "contactPhone",
		width: 110
	}, {
		title: "地址信息",
		dataIndex: "pickupAddress",
		key: "pickupAddress"
	}]
	const tableProps = {
		dataSource: list,
		pagination,
		columns: columns,
		rowKey: (r => r.id),
		loading: loading.effects["searchByPlatformCode/query"],
		bordered: true,
		onChange(_pagination) {
			dispatch(routerRedux.replace({
				pathname,
				search: queryString.stringify({
					...query,
					page: _pagination.current,
					pageSize: _pagination.pageSize
				})
			}))
		}
	}
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Table {...tableProps}/>
		</div>
	)
}

const mapStateProps = ({resource, loading, customer, searchByPlatformCode}) =>
	({resource, loading, customer, searchByPlatformCode})


export default connect(mapStateProps)(IndexPage)
