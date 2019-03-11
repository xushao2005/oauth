import React, {PureComponent} from "react"
import {connect} from "dva"
import {Button, Icon, Modal, Row, Table, Upload} from "antd"
import classnames from "classnames"
import {styles} from "../../../../components/layouts"
import JobViewModal from "./view"

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
		this.props.dispatch({
			type: "customerImportJob/query",
			payload: {}
		})
		this.setState({
			visible: true
		})
	}
	reload = () => {
		this.props.dispatch({
			type: "customerImportJob/query",
			payload: {}
		})
	}

	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		const {children, loading, customerImportJob, dispatch} = this.props
		const importProps = {
			multiple: false,
			name: "file",
			action: "/api/customer/unsigned/import",
			headers: {
				authorization: "authorization-text"
			},
			beforeUpload(file) {
				const isExcel = file.name.endsWith(".xls") || file.name.endsWith(".xlsx")
				if (!isExcel) {
					Modal.error({
						title: "错误",
						content: "仅支持上传Excel文件"
					})
				}
				return isExcel
			},
			onChange(info) {
				if (info.file.status === "done") {
					Modal.info({
						content: info.file.response
					})
					dispatch({
						type: "customerImportJob/query",
						payload: {}
					})
				} else if (info.file.status === "error") {
					const resp = info.file.response
					Modal.error({
						content: resp.error
					})
				}
			}
		}
		const {list, pagination} = customerImportJob
		const listProps = {
			dataSource: list,
			loading: loading.effects["customerImportJob/query"],
			pagination,
			onChange(_pagination) {
				dispatch({
					type: "customerImportJob/query",
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
				render: text => (
					<JobViewModal
						entityId={text}
					>
						<div className={styles.view}>
							<Icon title="查看" type="eye-o" className={styles.viewIcon}/> {text}
						</div>
					</JobViewModal>
				)
			}, {
				title: "任务状态",
				dataIndex: "status",
				key: "status",
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
							失败（{record.failedCount}）
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
					title="批量创建非正式客户"
					style={{top: 0}}
					width="100%"
					height="100%"
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
					footer={null}
					onCancel={this.hideModelHandler}
					visible={this.state.visible}
				>
					<Row style={{marginBottom: 20}}>
						<a style={{marginRight: 25}} target="_blank" href="/template/非正式客户清单模板.xlsx">下载清单模板</a>
						<Upload {...importProps}>
							<Button type="primary">
								<Icon type="upload"/> 上传表格清单
							</Button>
						</Upload>
					</Row>
					<Row>
						<div style={{textAlign: "right", marginBottom: 16}}>
							<Button size="small" icon="reload" onClick={this.reload}>
								刷新列表
							</Button>
						</div>
					</Row>
					<Table
						{...listProps}
						bordered
						columns={columns}
						scroll={{x: 320}}
						rowKey={record => record.id}
					/>
				</Modal>}
			</span>
		)
	}
}

export default connect(mapStateToProps)(IndexComponent)
