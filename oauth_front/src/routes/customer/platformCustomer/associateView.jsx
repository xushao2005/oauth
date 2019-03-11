import React, {Component} from "react"
import {Table, Modal, Button, Spin, Row, Col, Popconfirm, Icon} from "antd"
import classNames from "classnames"
import {styles} from "../../../components/layouts"
import viewStyles from "./associateView.less"
import SuccessView from "../../../components/data/successView"
import ErrorView from "../../../components/data/errorView"

class AssociateModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			resultVisible: false,
			visible: false,
			showButton: false,
			customerCode: null,
			platformCustomerIds: [],
			page: 1,
			pageSize: 10,
			showFastButton: false,
		}
	}

	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		if (payload) {
			dispatch({
				type: "platformCustomer/searchSimilarCustomer",
				payload: {
					phone: payload
				}
			})
			dispatch({
				type: "platformCustomer/searchSimilarPlatformCustomer",
				payload: {
					phone: payload,
					page: this.state.page,
					pageSize: this.state.pageSize
				}
			})
		}
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
	}
	// 隐藏模态框，重置数据选中状态
	hideModelHandler = () => {
		// 刷新table
		const {onCancel} = this.props
		onCancel()
		this.setState({
			resultVisible: false,
			visible: false,
			showButton: false,
			customerCode: null,
			platformCustomerIds: [],
			showFastButton: false,
		})
	}
	// 重置关联结果 Modal完全关闭后的回调
	resetAssociateStatus = () => {
		const {dispatch} = this.props
		dispatch({
			type: "platformCustomer/saveAssociateResult",
			payload: []
		})
	}

	// 燕文客户选中修改回调
	customerRowOnChange = (selectedRowKeys) => {
		const customerCode = selectedRowKeys[0]
		// 选择显示快速关联按钮
		this.setState({
			customerCode: customerCode,
			showFastButton: true,
		})
		// 在修改状态的方法结束之前 this.state.customerCode还未改变 所以传递customerCode而不是this.state.customerCode
		this.showButtonOnChange(customerCode, this.state.platformCustomerIds)
	}

	// 平台客户选中修改回调
	pltfrmCstmrRowOnChange = (selectedRowKeys) => {
		this.setState({platformCustomerIds: selectedRowKeys})
		this.showButtonOnChange(this.state.customerCode, selectedRowKeys)
	}
	// 是否显示关联按钮
	showButtonOnChange = (customerCode, platformCustomerIds) => {
		let showButton = false
		if (customerCode !== null && platformCustomerIds.length > 0) {
			showButton = true
		}
		this.setState({showButton: showButton})
	}
	// 关联操作
	associate = () => {
		const {dispatch} = this.props
		const payload = {}
		if (this.state.showButton) {
			const {customerCode, platformCustomerIds} = this.state
			Object.assign(payload, {customerCode}, {platformCustomerIds})
		} else {
			const {id} = this.props.record
			Object.assign(payload, {platformCustomerId: id})
		}
		dispatch({
			type: "platformCustomer/associateBatch",
			payload: payload
		})
		this.setState({
			resultVisible: true,
			showFastButton: false,
		})
	}
	// 快速关联操作
	fastAssociate = () => {
		const {dispatch, record} = this.props
		const {customerCode} = this.state
		const payload = {}
		const platformCustomerIds = []
		platformCustomerIds.push(record.id)
		Object.assign(payload, {customerCode}, {platformCustomerIds: platformCustomerIds})
		dispatch({
			type: "platformCustomer/associateBatch",
			payload: payload
		})
		this.setState({
			resultVisible: true
		})
	}

	render() {
		const {
			dispatch, payload, children, title, customerLoading,
			pltfrmCustomerLoading, associateLoading, loading
		} = this.props
		const {customerList, platformCustomerList, pagination, associateResult} = this.props.data
		// 燕文客户列表
		const customerColumns = [
			{
				title: "客户号",
				dataIndex: "customerCode",
				key: "customerCode"
			}, {
				title: "客户姓名",
				dataIndex: "customerName",
				key: "customerName"
			}, {
				title: "联系人姓名",
				dataIndex: "contactName",
				key: "contactName",
			}, {
				title: "联系号码",
				dataIndex: "contactPhone",
				key: "contactPhone"
			}, {
				title: "所属公司",
				dataIndex: "currentAffiliatedCompanyName",
				key: "currentAffiliatedCompanyName"
			}, {
				title: "结算公司",
				dataIndex: "currentSettleCompanyName",
				key: "currentSettleCompanyName"
			},
			// }, {
			// 	title: "是否活跃",
			// 	dataIndex: "active",
			// 	key: "active",
			// 	render: (text, record) => (record.tmsStatus ? "是" : "否")
			// }, {
			// 	title: "是否启用",
			// 	dataIndex: "enable",
			// 	key: "enable",
			// 	render: (text, record) => (record.enable ? "是" : "否")
			// }, {
			{
				title: "创建时间",
				dataIndex: "addTime",
				key: "addTime"
			}]
		const customerTableProps = {
			rowSelection: {
				type: "radio",
				onChange: this.customerRowOnChange
			},
			dataSource: customerList,
			pagination: false,
		}
		// 平台客户列表
		const columns = [
			{
				title: "来源平台",
				dataIndex: "sourceName",
				key: "sourceName"
			}, {
				title: "平台客户号",
				dataIndex: "transportCustomerCode",
				key: "transportCustomerCode"
			}, {
				title: "姓名",
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
				key: "streetAddress"
			}, {
				title: "状态",
				dataIndex: "associateFlag",
				key: "associateFlag",
				render: (text, record) => (record.associateFlag ? "已通知" : "未通知")
			}]
		const platformCstmTableProps = {
			rowSelection: {
				onChange: this.pltfrmCstmrRowOnChange,
			},
			dataSource: platformCustomerList,
			pagination: pagination,
			onChange(_pagination) {
				dispatch({
					type: "platformCustomer/searchSimilarPlatformCustomer",
					payload: {
						phone: payload,
						page: _pagination.current,
						pageSize: _pagination.pageSize
					}
				})
			}
		}
		const titleStyle = {
			marginBottom: 10,
			fontSize: 20
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
          		{children}
        		</span>
				<Modal
					title={title}
					style={{top: 0}}
					width="100%"
					height="100%"
					visible={this.state.visible}
					footer={<div>
						<Button onClick={this.hideModelHandler} size="large">关闭</Button>
					</div>}
					onCancel={this.hideModelHandler}
					wrapClassName={classNames(styles.fullModal, styles.modalForm, styles.viewModal)}
				>
					<Row type="flex" justify="center" style={titleStyle}>
						<Icon type="check-circle" style={{fontSize: 25, color: "#0088cc"}}/>
						为您筛选出{customerList.length}个相似燕文用户
					</Row>
					<Row className={viewStyles.row}>
					  <Spin spinning={customerLoading}>
							{!customerLoading &&
						<div>
							<Table
								{...customerTableProps}
								columns={customerColumns}
								bordered
								scroll={{x: 800}}
								rowKey={record => record.customerCode}
							/>
						</div>
							}
					  </Spin>
					</Row>
					<Row style={{marginBottom: 10}}>
						<Col offset={1}>
							{this.state.showButton &&
							<Button
								type="primary"
								onClick={this.associate}
								loading={associateLoading}
								size="large">批量关联</Button>
							}
							{!this.state.showButton &&
							<div>
								{this.state.showFastButton &&
									<Button
										type="primary"
										size="large"
										onClick={this.fastAssociate}
									>快速关联</Button>
								}
								<div className={viewStyles.inline}>
									请同时选择匹配到的燕文客户和匹配到的平台客户建立关联。
									<br/>
									如果找不到符合的燕文客户，请
									<Popconfirm title="是否创建默认客户并关联" onConfirm={this.associate}>
										<a href="">创建</a>
									</Popconfirm>
									新的燕文客户，建立关联
								</div>
							</div>
							}
						</Col>
					</Row>
					<Row type="flex" justify="center" style={titleStyle}>
						<Icon type="check-circle" style={{fontSize: 25, color: "#08c"}}/>
						为您筛选出{pagination.total}相似平台用户
					</Row>
					<Row className={viewStyles.row}>
					  <Spin spinning={pltfrmCustomerLoading}>
							{!pltfrmCustomerLoading &&
						<div>
							<Table
								{...platformCstmTableProps}
								columns={columns}
								bordered
								scroll={{x: 800}}
								rowKey={record => record.id}
							/>
						</div>
							}
					  </Spin>
					</Row>
					<Modal
						visible={this.state.resultVisible}
						closable={false}
						footer={<div>
							<Button onClick={this.hideModelHandler} size="large">确认</Button>
						</div>}
						afterClose={this.resetAssociateStatus}
					>
						<Spin spinning={loading.effects["platformCustomer/associateBatch"]}>
							{!loading.effects["platformCustomer/associateBatch"] && associateResult.associateStatus &&
							<SuccessView
								imgStyle={viewStyles.img}
								title="关联结果"
								desc={`已关联到 燕文客户号${associateResult.customerCode}`}/>
							}
							{!loading.effects["platformCustomer/associateBatch"] && !associateResult.associateStatus &&
							<ErrorView
								title="关联结果"
								desc="关联失败"/>
							}
						</Spin>
					</Modal>
				</Modal>
			</span>
		)
	}
}

export default AssociateModal
