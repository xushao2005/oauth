import React from "react"
import {connect} from "dva"
import {Icon, Table, Row, Button} from "antd"
import queryString from "query-string"
import {routerRedux} from "dva/router"
import Filter from "./filter"
import ExchangeRateFormModal from "./form"
import {elementAuth} from "../../utils/auth"

const ExchangeRateIndexPage = ({location, dispatch, exchangeRate, resource,
								   selectCurrency, loading}) => {
	const {list, pagination} = exchangeRate
	const filterProps = {
		dispatch,
		selectCurrency,
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
		loading: loading.effects["exchangeRate/query"],
		pagination,
		onChange (_pagination) {
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
	const createHandler = (values) => {
		dispatch({
			type: "exchangeRate/create",
			payload: values
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "exchangeRate/update",
			payload: {
				id,
				...values,
				query: queryString.parse(location.search)
			}
		})
	}
	const columns = [
		{
			title: "源币种",
			dataIndex: "orgCurrencyName",
			key: "orgCurrencyName"
		},
		{
			title: "目标币种",
			dataIndex: "targetCurrencyName",
			key: "targetCurrencyName"
		},
		{
			title: "汇率",
			dataIndex: "rate",
			key: "rate"
		},
		{
			title: "开始时间",
			dataIndex: "beginTime",
			key: "beginTime"
		},
		{
			title: "结束时间",
			dataIndex: "endTime",
			key: "endTime"
		},
		{
			title: "备注",
			dataIndex: "mark",
			key: "mark"
		},
		/*		{
			title: "操作",
			key: "action",
			width: 120,
			render: (text, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <ExchangeRateFormModal
							title="编辑"
							onOk={updateHandler.bind(null, record.id)}
							record={record}
							payload={{id: record.id}}
							confirmLoading={loading.effects["exchangeRate/update"]}
							dispatch={dispatch}
							editable={false}
							selectCurrency={selectCurrency}
						>
							<Icon type="edit"/>编辑
						</ExchangeRateFormModal>}
					</span>
				</div>
			)
		}*/
	]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			{/*			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <ExchangeRateFormModal
						title="新增"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["exchangeRate/create"]}
						dispatch={dispatch}
						selectCurrency={selectCurrency}
						editable
					>
						<Button size="large" type="primary">新增</Button>
					</ExchangeRateFormModal>}
				</div>
			</Row>*/}
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 850}}
				rowKey={record => record.id}
			/>
		</div>
	)
}

const mapStateToProps = ({exchangeRate, selectCurrency, resource, loading}) =>
	({exchangeRate, selectCurrency, resource, loading})

export default connect(mapStateToProps)(ExchangeRateIndexPage)
