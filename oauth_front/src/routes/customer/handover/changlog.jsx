import React, {PureComponent} from "react"
import {Modal, Table, Tooltip} from "antd"
import {connect} from "dva"
import classnames from "classnames"
import {styles} from "../../../components/layouts"

const mapStateToProps = ({loading, employeeChangelog}) => ({loading, employeeChangelog})

class IndexModal extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		if (e) e.preventDefault()
		this.props.dispatch({
			type: "employeeChangelog/query",
			payload: {}
		})
		this.setState({
			visible: true
		})
	}
	donwloadErrors = (id, e) => {
		if (e) e.preventDefault()
		window.open(`/api/batch/employee/changelog/errors/${id}`, "top")
	}

	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		const {loading, children, employeeChangelog, dispatch} = this.props
		const {list, pagination} = employeeChangelog
		const listProps = {
			dataSource: list,
			loading: loading.effects["employeeChangelog/query"],
			pagination,
			onChange(_pagination) {
				dispatch({
					type: "employeeChangelog/query",
					payload: {
						page: _pagination.current,
						pageSize: _pagination.pageSize
					}
				})
			}
		}
		const columns = [
			{
				title: "任务编号",
				dataIndex: "id",
				key: "id",
			}, {
				title: "任务类型",
				dataIndex: "changeType",
				key: "changeType",
				render: (text) => {
					let changeType = "销售员交接"
					switch (text) {
						case "receiver":
							changeType = "收款客服交接"
							break
						default:
					}
					return changeType
				}
			}, {
				title: "原员工",
				dataIndex: "originName",
				key: "origin",
			}, {
				title: "目标员工",
				dataIndex: "targetName",
				key: "target"
			}, {
				title: "生效时间",
				dataIndex: "effectTime",
				key: "effectTime"
			}, {
				title: "任务状态",
				dataIndex: "processStatus",
				key: "processStatus",
				render: (text) => {
					let status = "待处理"
					switch (text) {
						case 2:
							status = "已处理"
							break
						case 1:
							status = "正在处理"
							break
						default:
					}
					return status
				}
			}, {
				title: "任务概略",
				dataIndex: "id",
				key: "taskSummary",
				render: (id, record) => {
					const nodes = []
					if (record.successfullyCount !== 0) {
						nodes.push(<span key={0} style={{marginRight: 20}}>
							成功（{record.successfullyCount}）
						</span>)
					}
					if (record.failedCount !== 0) {
						nodes.push(<span key={1} style={{marginRight: 20}}>
							错误
							<Tooltip title="点击下载，查看错误客户号及其错误原因">
							（<a onClick={this.donwloadErrors.bind(null, id)}>{record.failedCount}</a>）
							</Tooltip>
						</span>)
					}
					if (record.waitingCount !== 0) {
						nodes.push(<span key={2} style={{marginRight: 20}}>
							待处理（{record.waitingCount}）
						</span>)
					}
					return (<span>
						{nodes}
					</span>)
				}
			}, {
				title: "操作者",
				dataIndex: "operator",
				key: "operator"
			}, {
				title: "任务触发时间",
				dataIndex: "createTime",
				key: "createTime"
			}
		]
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible && <Modal
					title="交接日志"
					style={{top: 0}}
					width="100%"
					height="100%"
					onCancel={this.hideModelHandler}
					visible={this.state.visible}
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.ViewModal)}
					footer={null}
				>
					<Table
						{...listProps}
						bordered
						columns={columns}
						scroll={{x: 750}}
						rowKey={record => record.id}
					/>
				</Modal>}
			</span>
		)
	}
}

export default connect(mapStateToProps)(IndexModal)
