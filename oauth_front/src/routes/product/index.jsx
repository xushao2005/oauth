/* eslint-disable no-restricted-globals */
import React from "react"
import {connect} from "dva"
import {AutoComplete, Button, Icon, Input, Row, Select, Table} from "antd"
import queryString from "query-string"
import {routerRedux} from "dva/router"
import {styles} from "../../components/layouts"
import ViewModal from "./view"
import FormModal from "./form"
import FilterModal from "./filter"
import {elementAuth} from "../../utils/auth"
import WhiteBlackRule from "./whiteBlackRule"
import {EFFECTIVENESS_CONSTANTS, QUOTE_TYPE_CONSTANTS} from "../../constants/product"

const Option = Select.Option

const IndexPage = ({location, dispatch, product, selectCompany, chinaPostType,
										 platformType, electricType, productType, resource, loading, selectEmployee,
										 productGroup, saleProductType, innerProductType,
										 limitedCatalog, normalCatalog, productWhiteBlackRule
									 }) => {
	const {list, pagination, productCode, expand, recommendLevels} = product
	const {search, pathname} = location
	const query = queryString.parse(search)
	const {companies} = selectCompany
	const electricTypes = electricType.list
	const productTypes = productType.list
	const chinaPostTypes = chinaPostType.list
	const productGroups = productGroup.list
	const saleProductTypes = saleProductType.list
	const innerProductTypes = innerProductType.list
	const limitedCatalogs = limitedCatalog.list
	const normalCatalogs = normalCatalog.list
	const totalLevel2Catalogs = normalCatalogs.concat(limitedCatalogs)
	const filterProps = {
		dispatch,
		filter: {
			...queryString.parse(location.search)
		},
		expand,
		electricTypes,
		chinaPostTypes,
		productTypes,
		productGroups,
		saleProductTypes,
		innerProductTypes,
		limitedCatalogs,
		normalCatalogs,
		totalLevel2Catalogs,
		recommendLevels,
		onFilterChange(fields) {
			dispatch(routerRedux.replace({
				pathname: location.pathname,
				search: queryString.stringify({
					...fields
				})
			}))
			// const payload = {...fields}
			// dispatch({
			// 	type: "product/query",
			// 	payload
			// })
		}
	}
	const level2CatalogsData = []
	totalLevel2Catalogs.forEach((item) => {
		const temp = {}
		for (const key in item) {
			if ({}.hasOwnProperty.call(item, key)) {
				temp.text = item.value
				temp.value = item.ikey
			}
		}
		level2CatalogsData.push(temp)
	})

	const listProps = {
		dataSource: list,
		loading: loading.effects["product/query"] || loading.effects["product/remove"],
		pagination,
		onChange(_pagination, filters) {
			const params = {}
			if (filters.lineOff && filters.lineOff[0]) {
				params.lineOff = filters.lineOff[0]
			} else {
				params.lineOff = undefined
			}
			if (filters.normalCatalog && filters.normalCatalog[0]) {
				params.normalCatalog = filters.normalCatalog[0]
			} else {
				params.normalCatalog = undefined
			}
			if (filters.cpFlag && filters.cpFlag[0]) {
				params.cpFlag = filters.cpFlag[0]
			} else {
				params.cpFlag = undefined
			}
			if (filters.omnidistance && filters.omnidistance[0]) {
				params.omnidistance = filters.omnidistance[0]
			} else {
				params.omnidistance = undefined
			}
			if (filters.chinaPost && filters.chinaPost[0]) {
				params.chinaPost = filters.chinaPost[0]
			} else {
				params.chinaPost = undefined
			}
			if (filters.track && filters.track[0]) {
				params.track = filters.track[0]
			} else {
				params.track = undefined
			}
			if (filters.calcGweight && filters.calcGweight[0]) {
				params.calcGweight = filters.calcGweight[0]
			} else {
				params.calcGweight = undefined
			}
			if (filters.enable && filters.enable[0]) {
				params.enable = filters.enable[0]
			} else {
				params.enable = undefined
			}
			if (filters.byAir && filters.byAir[0]) {
				params.byAir = filters.byAir[0]
			} else {
				params.byAir = undefined
			}
			if (filters.recommendLevel && filters.recommendLevel[0]) {
				params.recommendLevel = filters.recommendLevel[0]
			} else {
				params.recommendLevel = undefined
			}
			if (filters.effectiveness && filters.effectiveness[0]) {
				params.effectiveness = filters.effectiveness[0]
			} else {
				params.effectiveness = undefined
			}
			if (filters.quoteType && filters.quoteType[0]) {
				params.quoteType = filters.quoteType[0]
			} else {
				params.quoteType = undefined
			}
			if (filters.level1Catalog && filters.level1Catalog[0]) {
				params.level1Catalog = filters.level1Catalog[0]
			} else {
				params.level1Catalog = undefined
			}
			if (filters.level2Catalogs && filters.level2Catalogs.length > 0) {
				params.level2Catalog = filters.level2Catalogs.join(",")
			} else {
				params.level2Catalog = []
			}
			dispatch(routerRedux.replace({
				pathname,
				search: queryString.stringify({
					...query,
					...params,
					page: _pagination.current,
					pageSize: _pagination.pageSize
				})
			}))
		}
	}
	const handleChange = (params) => {
		dispatch(routerRedux.replace({
			pathname,
			search: queryString.stringify({
				...query,
				page: pagination.page,
				pageSize: isNaN(pagination.pageSize) ? undefined : pagination.pageSize,
				...params
			})
		}))
	}
	const handleChinaPostTypeChange = (value) => {
		handleChange({chinaPostType: value})
	}
	const handleProductTypeChange = (value) => {
		handleChange({productType: value})
	}
	const handleProductCodeChange = (e) => {
		handleChange({productcode: e.target.value})
	}
	const handleProductNameChange = (e) => {
		handleChange({productname: e.target.value})
	}
	const handleProductGroupChange = (value) => {
		handleChange({productGroup: value})
	}
	const handleSaleProductTypeChange = (value) => {
		handleChange({saleProductType: value})
	}
	const handleInnerProductType = (value) => {
		handleChange({innerProductType: value})
	}
	const handleDirectorChange = (value) => {
		handleChange({director: value})
	}
	const createHandler = (values) => {
		dispatch({
			type: "product/create",
			payload: values
		})
	}
	const updateHandler = (productcode, values) => {
		dispatch({
			type: "product/update",
			payload: {
				productcode,
				...values,
				query: queryString.parse(location.search)
			}
		})
	}
	const getLevel1CatalogName = (text) => {
		let level1CatalogName = ""
		if (text === 1) {
			level1CatalogName = "普货"
		} else if (text === 2) {
			level1CatalogName = "特货"
		} else {
			level1CatalogName = ""
		}
		return level1CatalogName
	}
	const employeesAutoComplete = (value) => {
		if (value.length === 0) {
			handleChange({director: undefined})
		} else {
			dispatch({
				type: "selectEmployee/employeesAutoComplete",
				payload: {
					q: value
				}
			})
		}
	}
	const columns = [
		{
			title: "产品编号",
			dataIndex: "productcode",
			key: "productcode",
			filterDropdown: (
				<div className="ant-table-filter-dropdown">
					<Input style={{width: 90, margin: 3}} size="small" onChange={handleProductCodeChange}/>
				</div>
			)
		},
		{
			title: "产品名称",
			dataIndex: "productname",
			key: "productname",
			width: 220,
			filterDropdown: (
				<div className="ant-table-filter-dropdown">
					<Input style={{width: 200, margin: 3}} size="small" onChange={handleProductNameChange}/>
				</div>
			),
			render: (text, record) => (
				<ViewModal
					title="产品详情"
					viewLoading={loading.effects["product/view"]}
					dispatch={dispatch}
					record={record}
					recommendLevels={recommendLevels}
					platformType={platformType}
					payload={{productcode: record.productcode}}
				>
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</ViewModal>)
		},
		{
			title: "负责人",
			dataIndex: "directorName",
			key: "director",
			filterDropdown: (
				<div className="ant-table-filter-dropdown">
					<AutoComplete
						allowClear
						onSelect={handleDirectorChange}
						onSearch={employeesAutoComplete}
						style={{width: 150, marginLeft: 10}}
					>
						{selectEmployee.employees.map(item =>
							(<AutoComplete.Option key={item.id}>{item.name}</AutoComplete.Option>))}
					</AutoComplete>
				</div>
			)
		},
		{
			title: "产品来源",
			dataIndex: "lineOffName",
			key: "lineOff",
			filters: [
				{text: "平台", value: 0},
				{text: "非平台", value: 1}
			],
			filterMultiple: false,
			filteredValue: [query.lineOff]
		},
		{
			title: "产品类型",
			dataIndex: "productTypeName",
			key: "productTypeName",
			filterDropdown: (
				<div className="ant-table-filter-dropdown">
					<Select
						defaultValue={query.productType}
						style={{width: 150, margin: 3}}
						size="small"
						onChange={handleProductTypeChange}
						allowClear>
						{productTypes.map(item =>
							<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
						}
					</Select>
				</div>
			)
		},
		{
			title: "产品组",
			dataIndex: "productGroupName",
			key: "productGroupName",
			filterDropdown: (
				<div className="ant-table-filter-dropdown">
					<Select
						defaultValue={query.productGroup}
						style={{width: 150, margin: 3}}
						size="small"
						onChange={handleProductGroupChange}
						allowClear>
						{productGroups.map(item =>
							<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
						}
					</Select>
				</div>
			)
		},
		{
			title: "销售产品类型",
			dataIndex: "saleProductTypeName",
			key: "saleProductTypeName",
			filterDropdown: (
				<Select
					defaultValue={query.saleProductType}
					style={{width: 150, margin: 3}}
					size="small"
					onChange={handleSaleProductTypeChange}
					allowClear>
					{saleProductTypes.map(item =>
						<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
					}
				</Select>
			)
		},
		{
			title: "内部产品类型",
			dataIndex: "innerProductTypeName",
			key: "innerProductTypeName",
			filterDropdown: (
				<Select
					defaultValue={query.innerProductType}
					style={{width: 150, margin: 3}}
					onChange={handleInnerProductType}
					allowClear>
					{innerProductTypes.map(item =>
						<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
					}
				</Select>
			)
		},
		{
			title: "自有产品推荐级别",
			dataIndex: "recommendLevel",
			key: "recommendLevel",
			render: (text) => {
				const recommend = recommendLevels.filter(item => Number(item.id) === Number(text))
				return recommend[0] && recommend[0].value ? recommend[0].value : ""
			},
			filters: [
				{text: "自有产品", value: 0},
				{text: "非自有产品", value: 1}
			],
			filterMultiple: false,
			filteredValue: [query.recommendLevel]
		},
		{
			title: "是否中邮产品",
			dataIndex: "cpFlag",
			key: "cpFlag",
			render: text => (
				text ? "是" : "否"
			),
			filters: [
				{text: "是", value: true},
				{text: "否", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.cpFlag]
		},
		{
			title: "中邮类型",
			dataIndex: "cpTypeName",
			key: "cpTypeName",
			filterDropdown: (
				<div className="ant-table-filter-dropdown">
					<Select
						defaultValue={query.chinaPostType}
						style={{width: 150, margin: 3}}
						size="small"
						onChange={handleChinaPostTypeChange}
						allowClear>
						{chinaPostTypes.map(item =>
							<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
						}
					</Select>
				</div>
			)
		},
		{
			title: "是否全程",
			dataIndex: "omnidistance",
			key: "omnidistance",
			render: text => (
				text ? "是" : "否"
			),
			filters: [
				{text: "是", value: true},
				{text: "否", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.omnidistance]
		},
		{
			title: "是否中邮全程",
			dataIndex: "chinaPost",
			key: "chinaPost",
			render: text => (
				text ? "是" : "否"
			),
			filters: [
				{text: "是", value: true},
				{text: "否", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.chinaPost]
		},
		{
			title: "是否可追踪",
			dataIndex: "track",
			key: "track",
			render: text => (
				text ? "全程追踪" : "半程追踪"
			),
			filters: [
				{text: "全程追踪", value: true},
				{text: "半程追踪", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.track]
		},
		{
			title: "是否计泡",
			dataIndex: "calcGweight",
			key: "calcGweight",
			render: (text) => {
				if (text === undefined) {
					return ""
				} else {
					return text ? "是" : "否"
				}
			},
			filters: [
				{text: "是", value: true},
				{text: "否", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.calcGweight]
		},
		{
			title: "产品计泡系数",
			dataIndex: "calcGweightRate",
			key: "calcGweightRate"
		},
		{
			title: "是否走空运",
			dataIndex: "byAir",
			key: "byAir",
			render: text => (
				text ? "是" : "否"
			),
			filters: [
				{text: "是", value: true},
				{text: "否", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.byAir]
		},
		{
			title: "时效等级",
			dataIndex: "effectiveness",
			key: "effectiveness",
			render: text => (
				EFFECTIVENESS_CONSTANTS.get(text)
			),
			filters: [
				{text: "快", value: 1},
				{text: "中", value: 2},
				{text: "慢", value: 3}
			],
			filterMultiple: false,
			filteredValue: [query.effectiveness]
		},
		{
			title: "是否合并报价",
			dataIndex: "quoteType",
			key: "quoteType",
			render: text => (
				QUOTE_TYPE_CONSTANTS.get(text)
			),
			filters: [
				{text: "合并", value: "C"},
				{text: "各自报价", value: "E"}
			],
			filterMultiple: false,
			filteredValue: [query.quoteType]
		},
		{
			title: "货品一级属性",
			dataIndex: "level1Catalog",
			key: "level1Catalog",
			render: text => (<span>{getLevel1CatalogName(text)}</span>),
			filters: [
				{text: "普货", value: "1"},
				{text: "特货", value: "2"}
			],
			filterMultiple: false,
			filteredValue: [query.level1Catalog]
		},
		{
			title: "货品二级属性",
			dataIndex: "level2Catalogs",
			key: "level2Catalogs",
			render: text => ((text && text.length) ? text.join("、") : ""),
			filters: level2CatalogsData
		},
		{
			title: "是否启用",
			dataIndex: "enable",
			key: "enable",
			render: text => (
				text ? "是" : "否"
			),
			filters: [
				{text: "是", value: true},
				{text: "否", value: false}
			],
			filterMultiple: false,
			filteredValue: [query.enable]
		},
		{
			title: "操作",
			key: "operation",
			width: 150,
			fixed: "right",
			render: (_, record) => (
				<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑", resource.currentResources) && <FormModal
							title="产品编辑"
							record={record}
							companies={companies}
							electricTypes={electricTypes}
							productTypes={productTypes}
							chinaPostTypes={chinaPostTypes}
							productGroups={productGroups}
							selectEmployee={selectEmployee}
							saleProductTypes={saleProductTypes}
							innerProductTypes={innerProductTypes}
							limitedCatalogs={limitedCatalogs}
							normalCatalogs={normalCatalogs}
							platformType={platformType}
							onOk={updateHandler.bind(null, record.productcode)}
							confirmLoading={loading.effects["product/update"]}
							dispatch={dispatch}
							payload={{productcode: record.productcode}}
							productCode={record.productcode}
						>
							<Icon type="edit"/>编辑
						</FormModal>}
						{elementAuth(location, "设置产品客户规则", resource.currentResources) && <WhiteBlackRule
							title={<span>产品客户规则（产品名称：
							<span style={{fontWeight: 800}}>{record.productname}</span>
								，产品编码：
							<span style={{fontWeight: 800}}>{record.productcode}</span>
							）</span>}
							record={record}
							dispatch={dispatch}
							loading={loading}
							location={location}
							resource={resource}
							productWhiteBlackRule={productWhiteBlackRule}
						>
							<Icon type="setting" style={{marginLeft: 8}}/>产品客户规则
						</WhiteBlackRule>}
					</span>
				</div>
			)
		}
	]
	return (
		<div className="content-inner">
			<FilterModal {...filterProps}/>
			<Row gutter={24}>
				<div style={{textAlign: "right", marginBottom: 16}}>
					{elementAuth(location, "新增", resource.currentResources) && <FormModal
						title="产品新增"
						record={{}}
						productCode={productCode}
						companies={companies}
						electricTypes={electricTypes}
						productTypes={productTypes}
						chinaPostTypes={chinaPostTypes}
						productGroups={productGroups}
						saleProductTypes={saleProductTypes}
						selectEmployee={selectEmployee}
						innerProductTypes={innerProductTypes}
						limitedCatalogs={limitedCatalogs}
						normalCatalogs={normalCatalogs}
						recommendLevels={recommendLevels}
						confirmLoading={loading.effects["product/create"]}
						platformType={platformType}
						onOk={createHandler}
						dispatch={dispatch}
					>
						<Button size="large" type="primary">新增</Button>
					</FormModal>}
				</div>
			</Row>
			<Table
				{...listProps}
				bordered
				columns={columns}
				scroll={{x: 2400}}
				rowKey={record => record.productcode}
			/>
		</div>
	)
}

const mapStateToProps = ({product, selectCompany, productType, chinaPostType, platformType,
	electricType, productGroup, saleProductType, innerProductType, limitedCatalog,
	normalCatalog, productWhiteBlackRule, resource, loading, selectEmployee}) => ({
	product,
	selectCompany,
	productType,
	chinaPostType,
	platformType,
	electricType,
	productGroup,
	saleProductType,
	innerProductType,
	limitedCatalog,
	normalCatalog,
	productWhiteBlackRule,
	resource,
	loading,
	selectEmployee
})

export default connect(mapStateToProps)(IndexPage)
