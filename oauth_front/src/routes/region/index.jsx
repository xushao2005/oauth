import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {styles} from "../../components/layouts"
import {elementAuth} from "../../utils/auth"
import RegionFormModal from "./form"
import RegionViewModal from "./view"
import AdministrativeViewModal from "./administrative/index"
import Filter from "./filter"

const RegionIndexPage = ({location, dispatch, region, selectRegion, resource, loading}) => {
	const {list, pagination} = region
	const filterProps = {
		dispatch,
		filter: {
			...queryString.parse(location.search)
		},
		selectRegion,
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
		loading: loading.effects["region/query"] || loading.effects["region/remove"],
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
			type: "region/create",
			payload: values
		})
	}
	const updateHandler = (id, values) => {
		dispatch({
			type: "region/update",
			payload: {
				id,
				...values,
				query: queryString.parse(location.search)
			}
		})
	}
	const columns = [
		{
			title: "国家编号",
			dataIndex: "id",
			key: "id",
			width: 80,
			render: (text, record) => (
				<RegionViewModal
					title="国家详情"
					viewLoading={loading.effects["region/view"]}
					dispatch={dispatch}
					record={record}
					payload={{id: record.id}}
				>
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</RegionViewModal>)
		},
		{
			title: "国家中文名称",
			dataIndex: "chinesename",
			key: "chinesename"
		},
		{
			title: "国家中文拼音",
			dataIndex: "chinesepinyin",
			key: "chinesepinyin"
		},
		{
			title: "国家英文名称",
			dataIndex: "englishname",
			key: "englishname",
			width: 120
		},
		{
			title: "国家英文二字码",
			dataIndex: "english2bit",
			key: "english2bit"
		},
		{
			title: "国家中文四字简称",
			dataIndex: "chinese4bit",
			key: "chinese4bit"
		},
		{
			title: "速卖通二字码",
			dataIndex: "aliExpress2bit",
			key: "aliExpress2bit"
		},
		{
			title: "万邑通二字码",
			dataIndex: "winit2bit",
			key: "winit2bit"
		},
		{
			key: "operation",
			width: 160,
			render: (_, record) => (
				<div className="operation">
					<span className="operationItem">
						{<AdministrativeViewModal
							title="行政区域规划"
							location={location}
							region={record}
						>
							<Icon type="setting"/>行政区域规划
						</AdministrativeViewModal>}
					</span>
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <RegionFormModal
							title="国家编辑"
							onOk={updateHandler.bind(null, record.id)}
							confirmLoading={loading.effects["region/update"]}
							dispatch={dispatch}
							record={record}
							payload={{id: record.id}}
						>
							<Icon type="edit"/>编辑
						</RegionFormModal>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <RegionFormModal
						title="国家新增"
						record={{}}
						onOk={createHandler}
						confirmLoading={loading.effects["region/create"]}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</RegionFormModal>}
				</div>
			</Row>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 930}}
				rowKey={record => record.id}
			/>
		</div>
	)
}

const mapStateToProps = ({region, selectRegion, resource, loading}) =>
	({region, selectRegion, resource, loading})

export default connect(mapStateToProps)(RegionIndexPage)
