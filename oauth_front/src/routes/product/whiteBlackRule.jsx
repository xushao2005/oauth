import React, {Component} from "react"
import {Modal, Table, Row, Button, Icon, Popconfirm} from "antd"
import classnames from "classnames"
import queryString from "query-string"
import {styles} from "../../components/layouts"
import WhiteBlackRuleForm from "./whiteBlackRuleForm"
import WhiteBlackRuleView from "./whiteBlackRuleView"
import WhiteBlackRuleFilter from "./whiteBlackRuleFilter"
import {elementAuth} from "../../utils/auth"
import {productApi} from "../../constants/api"

class WhiteBlackRuleIndex extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}
	showModelHandler = () => {
		const {dispatch, record} = this.props
		this.setState({
			visible: true
		})
		dispatch({
			type: "productWhiteBlackRule/query",
			payload: {
				productCode: record.productcode
			}
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}
	handleRulesClear = () => {
		const {dispatch} = this.props
		dispatch({
			type: "productWhiteBlackRule/clear"
		})
	}
	createHandler = (values) => {
		const {dispatch, record} = this.props
		dispatch({
			type: "productWhiteBlackRule/create",
			payload: {
				...values,
				productCode: record.productcode
			}
		})
	}
	updateHandler = (values) => {
		const {dispatch, record} = this.props
		dispatch({
			type: "productWhiteBlackRule/update",
			payload: {
				...values,
				productCode: record.productcode
			}
		})
	}
	handleConfirm = (r) => {
		const {dispatch, record} = this.props
		dispatch({
			type: "productWhiteBlackRule/delete",
			payload: {
				id: r.id,
				productCode: record.productcode
			}
		})
	}
	handleExport = (r) => {
		const {record} = this.props
		const params = {
			id: r.id,
			productCode: record.productcode,
			productName: record.productname,
			whiteBlackListCustomers: r.whiteBlackListCustomers,
			mode: r.mode
		}
		window.open(`${productApi.exportCustomer}?${queryString.stringify(params)}`, "top")
	}
	render() {
		const {children, title, dispatch, loading, location, resource} = this.props
		const {rules, queryRules, customerCode} = this.props.productWhiteBlackRule
		const modalProps = {
			closable: false,
			title: title,
			width: "100%",
			height: "100%",
			visible: this.state.visible,
			wrapClassName: classnames(styles.fullModal, styles.modalForm),
			footer: (<Button onClick={this.hideModelHandler} type="primary">关闭</Button>),
			afterClose: this.handleRulesClear
		}
		const whiteBlackRuleFormProps = {
			title: "编辑规则",
			dispatch: dispatch,
			onOk: this.updateHandler
		}
		const newWhiteBlackRuleFormProps = {
			title: "新增规则",
			dispatch: dispatch,
			r: {allCountries: true},
			onOk: this.createHandler
		}
		const columns = [{
			title: "规则名",
			dataIndex: "name",
			key: "name",
			width: 220,
			render: (text, r) => (
				<WhiteBlackRuleView r={r} title="查看规则">
					<div className={styles.view}>
						<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
					</div>
				</WhiteBlackRuleView>
			)
		}, {
			title: "规则类型",
			dataIndex: "mode",
			key: "mode",
			width: 80,
			render: text => (text === "white" ? "白名单" : (text === "black" ? "黑名单" : ""))
		},
		{
			title: "客户名单",
			dataIndex: "whiteBlackListCustomersNames",
			key: "whiteBlackListCustomersNames"
		},
		{
			title: "是否全部国家",
			dataIndex: "allCountries",
			key: "allCountries",
			width: 90,
			render: text => (text ? "是" : "否")
		}, {
			title: "国家名单",
			dataIndex: "countriesNames",
			key: "countriesNames",
			render: (text, r) => (r.allCountries ? "全部国家" : text)
		}, {
			title: "操作",
			key: "operation",
			width: 200,
			render: (_, r) =>
				(<div className="operation">
					<span className="operationItem">
						{elementAuth(location, "编辑产品客户规则", resource.currentResources) && <WhiteBlackRuleForm {...whiteBlackRuleFormProps} r={r}>
							<Icon type="edit" style={{marginLeft: 8}}/>编辑
						</WhiteBlackRuleForm>}
						{elementAuth(location, "删除产品客户规则", resource.currentResources) && <Popconfirm title="确定删除该规则？" onConfirm={this.handleConfirm.bind(null, r)}>
							<Icon type="delete" style={{marginLeft: 8}}/>删除
						</Popconfirm>}
						{elementAuth(location, "产品客户规则导出客户", resource.currentResources) && <span onClick={this.handleExport.bind(null, r)}>
							<Icon type="download" style={{marginLeft: 8}}/>导出客户
						</span>}
					</span>
				</div>)
		}]
		const tableProps = {
			bordered: true,
			pagination: false,
			dataSource: customerCode ? queryRules : rules,
			columns: columns,
			loading: loading.effects["productWhiteBlackRule/query"],
			rowKey: r => r.id
		}
		const whiteBlackRuleFilterProps = {
			customerCode,
			dispatch,
			onFilterChange(fields) {
				dispatch({
					type: "productWhiteBlackRule/queryByCode",
					payload: fields
				})
			}
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					{...modalProps}
					style={{top: 0}}
				>
					<Row gutter={24}>
						<WhiteBlackRuleFilter {...whiteBlackRuleFilterProps}/>
					</Row>
					{elementAuth(location, "新增产品客户规则", resource.currentResources) && <Row gutter={24}>
						<div style={{textAlign: "right", marginBottom: 16}}>
							<WhiteBlackRuleForm {...newWhiteBlackRuleFormProps}>
								<Button type="primary">新增规则</Button>
							</WhiteBlackRuleForm>
						</div>
					</Row>}
					<Table {...tableProps} style={{marginBottom: 49}}/>
				</Modal>
			</span>
		)
	}
}

export default WhiteBlackRuleIndex
