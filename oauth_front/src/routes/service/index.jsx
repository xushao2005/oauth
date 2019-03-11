import React from "react"
import {connect} from "dva"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {Row, Button, Table, Icon} from "antd"
import Filter from "./filter"
import FormModel from "./form"
import {elementAuth} from "../../utils/auth"

const IndexPage = ({location, dispatch, service, loading, selectSupplier,
	selectUnits, selectService, transportMode, serviceCalcType, resource}) => {
	const {list, pagination, currentService} = service
	console.log(serviceCalcType)
	const filterProps = {
		dispatch,
		filter: {
			...queryString.parse(location.search)
		},
		selectUnits,
		selectSupplier,
		service,
		selectService,
		transportMode,
		serviceCalcType,
		onFilterChange(fields) {
			if (!fields.supplierName) {
				fields.supplierName = undefined
			}
			if (!fields.serviceUnitId) {
				fields.serviceUnitId = undefined
			}
			dispatch(routerRedux.replace({
				pathname: location.pathname,
				search: queryString.stringify({
					...fields
				})
			}))
		}
	}
	const createHandler = (values) => {
		if (values.statusId) {
			values.statusId = true
		} else {
			values.statusId = false
		}
		dispatch({
			type: "service/create",
			payload: values
		})
	}
	const updataHandler = (id, values) => {
		if (values.statusId) {
			values.statusId = true
		} else {
			values.statusId = false
		}
		const params = {
			id,
			...values,
			query: queryString.parse(location.search)
		}
		dispatch({
			type: "service/update",
			payload: params
		})
	}
	// Table相关
	const listProps = {
		dataSource: list,
		pagination,
		loading: loading.effects["service/query"] || loading.effects["service/remove"],
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
			title: "供应商编码",
			dataIndex: "suppliercode",
			key: "suppliercode",
			width: 110
		}, {
			title: "供应商名称",
			dataIndex: "supplierName",
			key: "supplierName"
		}, {
			title: "服务编码",
			dataIndex: "code",
			key: "code",
			width: 100
		}, {
			title: "服务名称",
			dataIndex: "name",
			key: "name"
		}, {
			title: "最小服务单元编号",
			dataIndex: "serviceUnitId",
			key: "serviceUnitId"
		}, {
			title: "最小服务单元",
			dataIndex: "serviceUnitName",
			key: "serviceUnitName"
		}, {
			title: "运输方式",
			dataIndex: "transportId",
			key: "transportId",
			render: (text) => {
				const transport = transportMode.list.filter(item => Number(item.ikey) === Number(text))
				return transport[0] && transport[0].value ? transport[0].value : ""
			}
		}, {
			title: "服务计费维度",
			dataIndex: "calcType",
			key: "calcType",
			render: (text) => {
				const calcType = serviceCalcType.list.filter(item => Number(item.code) === Number(text))
				return calcType[0] && calcType[0].desc ? calcType[0].desc : ""
			}
		}, {
			title: "是否启用",
			dataIndex: "statusId",
			key: "statusId",
			render: text => (text ? "是" : "否")
		}, {
			title: "操作",
			dataIndex: "operation",
			key: "operation",
			width: "80px",
			render: (text, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <FormModel
							title="编辑服务配置"
							record={currentService}
							confirmLoading={loading.effects["service/update"]}
							viewLoading={loading.effects["service/view"]}
							onOk={updataHandler.bind(null, record.id)}
							dispatch={dispatch}
							selectSupplier={selectSupplier}
							selectUnits={selectUnits}
							service={service}
							transportMode={transportMode}
							serviceCalcType={serviceCalcType}
							payload={{code: record.code, id: record.id, serviceUnitId: record.serviceUnitId}}
						>
							<Icon type="edit"/>编辑
						</FormModel>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Row>
				<div style={{textAlign: "right", margin: "16px 0"}}>
					{elementAuth(location, "新增", resource.currentResources) && <FormModel
						title="新增服务配置"
						record={{}}
						confirmLoading={loading.effects["service/create"]}
						onOk={createHandler}
						dispatch={dispatch}
						selectSupplier={selectSupplier}
						selectUnits={selectUnits}
						service={service}
						transportMode={transportMode}
						serviceCalcType={serviceCalcType}
					>
						<Button size="large" type="primary">新增</Button>
					</FormModel>}
				</div>
			</Row>
			<Table
				{...listProps}
				bordered
				columns={columns}
				rowKey={record => record.id}
			/>
		</div>
	)
}

const mapStateToProps = ({service, loading, selectSupplier, selectUnits,
	selectService, transportMode, serviceCalcType, resource}) =>
	({service,
		loading,
		selectSupplier,
		selectUnits,
		selectService,
		transportMode,
		serviceCalcType,
		resource})
export default connect(mapStateToProps)(IndexPage)
