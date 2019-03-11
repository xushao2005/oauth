import React from "react"
import {connect} from "dva"
import {Icon, Table} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {styles} from "../../../components/layouts"
import CustomerViewModal from "../tabView"
import Filter from "./filter"

const SearchContactIndexPage =
	({location, dispatch, searchContact, customer, resource, loading, selectDistricts}) => {
		const {list, pagination} = searchContact
		const {editable, currentTab, mainTab} = customer
		const filterProps = {
			dispatch,
			selectDistricts,
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
			loading: loading.effects["searchContact/query"],
			pagination,
			onChange(_pagination) {
				const {query, pathname} = location
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
		const columns = [
			{
				title: "客户号",
				dataIndex: "customerCode",
				key: "customerCode",
				width: 88
			},
			{
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
			},
			{
				title: "联系人",
				dataIndex: "contactName",
				key: "contactName",
				width: 80
			},
			{
				title: "联系电话",
				dataIndex: "contactPhone",
				key: "contactPhone",
				width: 110
			},
			// {
			// 	title: "电子邮箱",
			// 	dataIndex: "email",
			// 	key: "email"
			// },
			{
				title: "省",
				dataIndex: "province",
				key: "province",
				width: 60
			},
			{
				title: "市",
				dataIndex: "city",
				key: "city",
				width: 60
			},
			{
				title: "区",
				dataIndex: "district",
				key: "district",
				width: 60
			},
			{
				title: "街道地址",
				dataIndex: "streetAddress",
				key: "streetAddress"
			}
			// {
			// 	title: "QQ",
			// 	dataIndex: "qq",
			// 	key: "qq"
			// },
			// {
			// 	title: "旺旺号",
			// 	dataIndex: "aliTalk",
			// 	key: "aliTalk"
			// },
			// {
			// 	title: "联系地址",
			// 	dataIndex: "pickupAddress",
			// 	key: "pickupAddress"
			// },
			// {
			// 	title: "创建时间",
			// 	dataIndex: "createTime",
			// 	key: "createTime"
			// }
		]
		return (
			<div className="content-inner">
				<Filter {...filterProps}/>
				<Table
					{...listProps}
					bordered
					columns={columns}
					scroll={{x: 580}}
					rowKey={record => record.id}
				/>
			</div>
		)
	}

const mapStateToProps = ({searchContact, customer, resource, loading, selectDistricts}) =>
	({searchContact, customer, resource, loading, selectDistricts})

export default connect(mapStateToProps)(SearchContactIndexPage)
