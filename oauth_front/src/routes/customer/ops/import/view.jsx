import React, {PureComponent} from "react"
import {connect} from "dva"
import {Modal, Table} from "antd"
import classnames from "classnames"
import {styles} from "../../../../components/layouts"

const mapStateToProps = ({customerImportJob, resource, loading}) =>
	({customerImportJob, resource, loading})

class IndexComponent extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		if (e) e.preventDefault()
		const {entityId, dispatch} = this.props
		dispatch({
			type: "customerImportJob/queryItems",
			payload: {jobId: entityId}
		})
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		const {children, loading, customerImportJob} = this.props
		const {items} = customerImportJob
		const listProps = {
			dataSource: items,
			loading: loading.effects["customerImportJob/queryItems"],
			pagination: false,
		}
		const columns = [
			{
				title: "编号",
				dataIndex: "id",
				key: "id"
			}, {
				title: "平台来源",
				dataIndex: "palmTypeString",
				key: "palmTypeString"
			}, {
				title: "客户名称",
				dataIndex: "customerName",
				key: "customerName"
			}, {
				title: "绑定客户号",
				dataIndex: "customerCode",
				key: "customerCode"
			}, {
				title: "联系电话",
				dataIndex: "phone",
				key: "phone"
			}, {
				title: "地址",
				dataIndex: "address",
				key: "address"
			}, {
				title: "所属公司",
				dataIndex: "warehouse",
				key: "warehouse"
			}, {
				title: "结算公司",
				dataIndex: "settleCompany",
				key: "settleCompany"
			}, {
				title: "销售",
				dataIndex: "saleMan",
				key: "saleMan"
			}, {
				title: "收款",
				dataIndex: "receiver",
				key: "receiver"
			}, {
				title: "对账",
				dataIndex: "checker",
				key: "checker"
			}, {
				title: "平台号",
				dataIndex: "palmCode",
				key: "palmCode"
			}, {
				title: "执行反馈",
				dataIndex: "message",
				key: "message"
			}, {
				title: "处理状态",
				dataIndex: "status",
				key: "status",
				render: (text) => {
					let status = "待处理"
					switch (text) {
						case 1:
							status = "成功"
							break
						case 2:
							status = "失败"
							break
						default:
					}
					return status
				}
			}
		]
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible && <Modal
					title="任务详情"
					style={{top: 0}}
					width="100%"
					height="100%"
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
					footer={null}
					onCancel={this.hideModelHandler}
					visible={this.state.visible}
				>
					<Table
						{...listProps}
						bordered
						columns={columns}
						scroll={{x: 1020}}
						rowKey={record => record.id}
					/>
				</Modal>}
			</span>
		)
	}
}

export default connect(mapStateToProps)(IndexComponent)
