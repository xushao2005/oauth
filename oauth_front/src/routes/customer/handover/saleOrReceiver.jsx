/* eslint-disable react/no-array-index-key */
import React, {Component} from "react"
import {connect} from "dva"
import {
	Alert,
	AutoComplete,
	Button,
	Col,
	DatePicker,
	Form,
	Icon,
	Input,
	Modal,
	Popconfirm,
	Popover,
	Radio,
	Row,
	Spin
} from "antd"
import moment from "moment/moment"
import {handleResetFields, patterns} from "../../../utils/form"
import styles from "./saleOrReceiver.less"
import ChangelogModal from "./changlog"
import Unauthorized from "../../index/505"
import {elementAuth} from "../../../utils/auth"

const dateFormat = "YYYY-MM-DD"
const AOption = AutoComplete.Option
const {TextArea} = Input

class CustomerSaleOrReceiverOps extends Component {
	constructor(props) {
		super(props)
		this.state = {
			processVisible: false
		}
	}

	componentDidMount() {
		this.props.dispatch({
			type: "saleOrReceiver/currentMetric"
		})
		this.props.form.validateFields()
	}

	// 获取员工相关
	currentCandidatesAutoComplete = (value) => {
		this.props.dispatch({
			type: "saleOrReceiver/currentCandidatesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	handoverCandidatesAutoComplete = (value) => {
		this.props.dispatch({
			type: "saleOrReceiver/handoverCandidatesAutoComplete",
			payload: {
				q: value
			}
		})
	}
	// 隐藏模态框，重置数据选中状态
	hideModelHandler = () => {
		this.setState({
			processVisible: false
		})
	}
	resetResult = () => {
		this.props.dispatch({
			type: "saleOrReceiver/preResetResult"
		})
		const ret = this.props.saleOrReceiver.result
		if (ret && ret.success) {
			handleResetFields(this.props.form, {
				currentEmployeeId: undefined,
				nextEmployeeId: undefined,
				customerCodes: undefined
			})
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({processVisible: true})
				this.props.dispatch({
					type: "saleOrReceiver/saleOrReceiverOpsStart",
					payload: values
				})
			}
		})
	}

	render() {
		const {saleOrReceiver, location, resource, form, loading} = this.props
		const canSwitchSale = elementAuth(location, "销售交接", resource.currentResources)
		const canSwitchReceiver = elementAuth(location, "收款交接", resource.currentResources)
		if (!canSwitchSale && !canSwitchReceiver) {
			return (<Unauthorized/>)
		}
		const colProps = {
			xs: 24,
			sm: 8
		}
		const formItemLayout = {
			labelCol: {
				xs: 24,
				sm: 7
			},
			wrapperCol: {
				xs: 24,
				sm: 17
			},
			style: {
				marginBottom: 16
			}
		}
		const {getFieldDecorator, getFieldsError, getFieldsValue, isFieldTouched, getFieldError} = form
		const currentEmployeeIdError = isFieldTouched("currentEmployeeId") && getFieldError("currentEmployeeId")
		const nextEmployeeIdError = isFieldTouched("nextEmployeeId") && getFieldError("nextEmployeeId")
		const customerCodesError = isFieldTouched("customerCodes") && getFieldError("customerCodes")
		const postType = canSwitchSale ? "sale" : "receiver"
		const hasErrors = fieldsError => Object.keys(fieldsError)
			.some(field => fieldsError[field])
		const processing = this.state.processVisible && saleOrReceiver.result === null
		const disabledEffectTime = (startValue) => {
			if (!startValue) {
				return false
			} else {
				const sevenDaysAgo = moment()
					.subtract({days: 7})
					.startOf("day")
				const nextDay = moment()
					.add({days: 7})
					.startOf("day")
				if (sevenDaysAgo.isBefore(startValue) && nextDay.isAfter(startValue)) {
					const dayOfWeek = startValue.day()
					const dateOfMonth = startValue.date()
					if (dayOfWeek === 1) {
						return false
					} else {
						return dateOfMonth !== 1
					}
				} else {
					return true
				}
			}
		}
		const {processingInfo} = saleOrReceiver
		const {main, detail} = processingInfo
		const summaryArray = []
		if (main && detail) {
			let countOfWaitingLog = 0
			let countOfDoingLog = 0
			let countOfDoneLog = 0
			main.forEach(
				(it) => {
					switch (it.process_status) {
						case 0:
							countOfWaitingLog = it.count
							break
						case 1:
							countOfDoingLog = it.count
							break
						case 2:
							countOfDoneLog = it.count
							break
						default:
					}
				}
			)
			const totalCountOfLog = countOfWaitingLog + countOfDoingLog + countOfDoneLog
			if (totalCountOfLog === 0) {
				summaryArray.push("未找到您当天处理的交接计划。")
			} else {
				let taskText = `当天，您共提交了${totalCountOfLog}条交接任务`
				if (countOfDoneLog > 0) {
					taskText += `，已经完成了${countOfDoneLog}个任务`
				}
				if (countOfDoingLog > 0) {
					taskText += `，有${countOfDoingLog}个任务正在执行`
				}
				if (countOfWaitingLog > 0) {
					taskText += `，有${countOfWaitingLog}个任务等待执行`
				}
				taskText += "。"
				let countOfWaitingDetail = 0
				let countOfSuccessfulDetail = 0
				let countOfFailedDetail = 0
				detail.forEach(
					(it) => {
						switch (it.status) {
							case 0:
								countOfWaitingDetail = it.count
								break
							case 1:
								countOfSuccessfulDetail = it.count
								break
							case 2:
								countOfFailedDetail = it.count
								break
							default:
						}
					}
				)
				let detailText = "当天，与您相关的客户号总体执行情况"
				if (countOfSuccessfulDetail > 0) {
					detailText += `，成功${countOfSuccessfulDetail}个`
				}
				if (countOfFailedDetail > 0) {
					detailText += `，失败${countOfFailedDetail}个`
				}
				if (countOfWaitingDetail > 0) {
					detailText += `，待处理${countOfWaitingDetail}个`
				}
				detailText += "。"
				summaryArray.push(taskText)
				summaryArray.push(detailText)
			}
		}
		let info
		if (main && detail) {
			info = (<Spin spinning={loading.effects["saleOrReceiver/currentMetric"]}>
				<div style={{paddingLeft: 30}}>
					{summaryArray.map((item, key) => (<p key={key}>{item}</p>))}
					<div style={{textAlign: "right", marginRight: 20, color: "blue"}}>
						<span style={{cursor: "pointer"}}>
							<ChangelogModal>
								<Icon type="eye-o" style={{marginRight: 5}}/>查看历史交接日志
							</ChangelogModal>
						</span>
					</div>
				</div>
			</Spin>)
		} else {
			info = (<Spin spinning>
				<div style={{paddingLeft: 30}}>正在载入中</div>
			</Spin>)
		}
		return (
			<div className="content-inner">
				<Form>
					<Row gutter={24} style={{marginBottom: 20}}>
						<Alert
							message={info}
							type="info"
							banner
							showIcon/>
					</Row>
					<Row gutter={24}>
						<Col {...colProps}>
							<Form.Item
								{...formItemLayout}
								label="交接岗位"
							>
								{getFieldDecorator("postType", {
									initialValue: postType,
									rules: [{
										required: true,
										message: "必填"
									}]
								})(
									<Radio.Group>
										{canSwitchSale && <Radio.Button value="sale">销售经理</Radio.Button>}
										{canSwitchReceiver && <Radio.Button value="receiver">收款客服</Radio.Button>}
									</Radio.Group>
								)
								}
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col {...colProps}>
							<Form.Item
								{...formItemLayout}
								label="当前员工"
								validateStatus={currentEmployeeIdError ? "error" : ""}
								help={currentEmployeeIdError || ""}
							>
								{getFieldDecorator("currentEmployeeId", {
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										pattern: patterns.digit,
										message: "请从下拉框中选择员工"
									}]
								})(
									<AutoComplete
										allowClear
										placeholder="选择当前员工"
										onChange={this.currentCandidatesAutoComplete}
										dropdownMatchSelectWidth={false}
										dropdownStyle={{minWidth: 150}}
										dataSource={saleOrReceiver.currentCandidates.map(item =>
											(<AOption key={item.id}>{item.name}</AOption>)
										)}
									/>
								)}
							</Form.Item>
						</Col>
						<Col {...colProps} style={{textAlign: "center"}}>
							<Form.Item
								{...formItemLayout}
							>
								<Popconfirm
									title={`确认执行${getFieldsValue()[postType] === "sale" ? "销售经理" : "收款客服"}交接？`}
									onConfirm={this.handleSubmit}
								>
									<Button
										type="primary"
										disabled={hasErrors(getFieldsError())}
										loading={this.state.processVisible}
									>交接</Button>
								</Popconfirm>
								<Popover content={(
									<div>
										交接规则：
										<ol type="1">
											<li>当前员工的生效时间必须在上周的周一之前（不包含周一）</li>
											<li>客户号必须归于同一个员工</li>
										</ol>
									</div>)}>
									<Icon style={{marginLeft: 10}} type="question-circle-o"/>
								</Popover>
							</Form.Item>
						</Col>
						<Col {...colProps}>
							<Form.Item
								{...formItemLayout}
								label="交接员工"
								validateStatus={nextEmployeeIdError ? "error" : ""}
								help={nextEmployeeIdError || ""}
							>
								{getFieldDecorator("nextEmployeeId", {
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										pattern: patterns.digit,
										message: "请从下拉框中选择员工"
									}]
								})(
									<AutoComplete
										allowClear
										placeholder="选择交接员工"
										onSearch={this.handoverCandidatesAutoComplete}
										dropdownMatchSelectWidth={false}
										dropdownStyle={{minWidth: 150}}
										dataSource={saleOrReceiver.handoverCandidates.map(item =>
											(<AOption key={item.id}>{item.name}</AOption>)
										)}
									/>
								)}
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col {...colProps}>
							<Form.Item
								{...formItemLayout}
								label="交接时间"
								validateStatus={customerCodesError ? "error" : ""}
								help={customerCodesError || ""}
							>
								{getFieldDecorator("effectTime", {
									rules: [{
										required: true,
										message: "必填"
									}]
								})(
									<DatePicker
										format={dateFormat}
										disabledDate={disabledEffectTime}
									/>
								)}
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col {...colProps}>
							<Form.Item
								{...formItemLayout}
								label="客户编号"
								validateStatus={customerCodesError ? "error" : ""}
								help={customerCodesError || ""}
							>
								{getFieldDecorator("customerCodes", {
									rules: [{
										required: true,
										message: "必填"
									}]
								})(
									<TextArea
										placeholder="请输入客户编号，用回车符分割"
										autosize={{minRows: 6}}
									/>
								)}
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Modal
					visible={this.state.processVisible}
					closable={false}
					footer={!processing && <div className={styles.centerBtn}>
						<Button onClick={this.hideModelHandler} type="primary">确认</Button>
					</div>}
					afterClose={this.resetResult}>
					{this.state.processVisible && (processing ?
						<div className={styles.center}>
							<Spin spinning className={styles.sucIcon} size="large"/>
							<p className={styles.message}>正在努力交接中，请稍等...</p>
						</div>
						:
						<div className={styles.center}>
							<span
								className={saleOrReceiver.result && saleOrReceiver.result.success
									? styles.sucIcon : styles.failIcon}>
								{saleOrReceiver.result && saleOrReceiver.result.success ?
									<Icon type="check-circle"/> : <Icon type="exclamation-circle"/>}
							</span>
							<p>{saleOrReceiver.result && saleOrReceiver.result.message}</p>
						</div>)
					}
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = ({saleOrReceiver, loading, resource}) =>
	({saleOrReceiver, loading, resource})
export default connect(mapStateToProps)(Form.create()(CustomerSaleOrReceiverOps))
