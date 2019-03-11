import React from "react"
import {connect} from "dva"
import {Button, Icon, Row, Table} from "antd"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {styles} from "../../components/layouts"
import {elementAuth} from "../../utils/auth"
import SupplierFormModal from "./form"
import SupplierViewModal from "./tabView"
import Filter from "./filter"

const SupplierIndexPage = ({location, dispatch, supplier, selectSupplier,
							   selectSupplierTypes, selectBorderTypes,
							   selectProductAreaTypes,
							   selectSupplierPaymentCompany,
							   selectSupplierPayCycle,
							   selectPaymentTerms,
							   selectCurrency,
							   selectRegion,
							   administrativeDivision,
							   resource, loading}) => {
	const {list, pagination, editable, mainTab, paymentTab, supplierCode} = supplier
	const selectOptions = {
		...selectSupplierTypes,
		...selectBorderTypes,
		...selectProductAreaTypes,
		...selectSupplierPaymentCompany,
		...selectSupplierPayCycle,
		...selectPaymentTerms,
		...selectCurrency,
		...selectRegion,
		...administrativeDivision
	}
	const filterProps = {
		dispatch,
		filter: {
			...queryString.parse(location.search)
		},
		selectSupplier,
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
		loading: loading.effects["supplier/query"],
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
			type: "supplier/create",
			payload: values
		})
	}
	const updateHandler = (code, values) => {
		dispatch({
			type: "supplier/update",
			payload: {
				code,
				...values,
				query: queryString.parse(location.search)
			}
		})
	}
	const columns = [
		{
			title: "供应商编码",
			dataIndex: "code",
			key: "code",
			width: 100
		},
		{
			title: "供应商中文名称",
			dataIndex: "nameCh",
			key: "nameCh",
			render: (text, record) => (
				<SupplierViewModal
					title="供应商详情"
					viewLoading={loading.effects["supplier/view"]}
					updateLoading={loading.effects["supplier/update"]}
					dispatch={dispatch}
					payload={{id: record.code, countryId: record.countryId}}
					location={location}
					resource={resource}
					onOk={updateHandler.bind(null, record.code)}
					editable={editable}
					mainTab={mainTab}
					paymentTab={paymentTab}
					supplierCode={record.code}
					selectOptions={selectOptions}
				>
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</SupplierViewModal>)
		},
		{
			title: "供应商英文名称",
			dataIndex: "nameEn",
			key: "nameEn"
		},
		{
			title: "供应商曾用名",
			dataIndex: "usedName",
			key: "usedName"
		},
		{
			title: "公司名称",
			dataIndex: "companyName",
			key: "companyName"
		},
		{
			title: "是否启用",
			dataIndex: "enable",
			key: "enable",
			render: (text, record) => (record.enable ? "是" : "否")
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime"
		}
	]
	return (
		<div className="content-inner">
			<Filter {...filterProps}/>
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增供应商", resource.currentResources) && <SupplierFormModal
						title="供应商新增"
						record={{}}
						supplierCode={supplierCode}
						onOk={createHandler}
						confirmLoading={loading.effects["supplier/create"]}
						dispatch={dispatch}
						selectOptions={selectOptions}
					>
						<Button size="large" type="primary">新增</Button>
					</SupplierFormModal>}
				</div>
			</Row>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 750}}
				rowKey={record => record.code}
			/>
		</div>
	)
}

const mapStateToProps = ({supplier, selectSupplier,
							 selectSupplierTypes, selectBorderTypes,
							 selectProductAreaTypes,
							 selectSupplierPaymentCompany,
							 selectSupplierPayCycle,
							 selectPaymentTerms,
							 selectCurrency,
							 selectRegion,
							 administrativeDivision,
							 resource, loading}) =>
	({supplier,
		selectSupplier,
		selectSupplierTypes,
		selectBorderTypes,
		selectProductAreaTypes,
		selectSupplierPaymentCompany,
		selectSupplierPayCycle,
		selectPaymentTerms,
		selectCurrency,
		selectRegion,
		resource,
		administrativeDivision,
		loading})

export default connect(mapStateToProps)(SupplierIndexPage)
