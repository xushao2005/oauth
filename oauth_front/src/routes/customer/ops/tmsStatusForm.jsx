import React, {Component} from "react"
import {connect} from "dva"
import {Button, Col, Form, Input, Modal, Row, Spin, Icon} from "antd"
import classnames from "classnames"
import {styles} from "../../../components/layouts"
import showStyles from "../handover/saleOrReceiver.less"
import {handleResetFields} from "../../../utils/form"
import {elementAuth} from "../../../utils/auth"
import style from "./pre.less"

const {TextArea} = Input

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			processVisible: false,
			visible: false
		}
	}
	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields()
	}
	// 隐藏模态框，重置数据选中状态
	hideModelHandler = () => {
		this.setState({
			processVisible: false
		})
	}
	resetResult = () => {
		this.props.dispatch({
			type: "tmsStatus/resetResult"
		})
		const ret = this.props.tmsStatus.result
		if (ret && ret.success) {
			handleResetFields(this.props.form, {
				customerCodes: undefined,
				tmsStatus: undefined
			})
			this.props.form.validateFields()
		}
	}
	// handleSubmit = (e) => {
	// 	e.preventDefault()
	// 	this.props.form.validateFields((err, values) => {
	// 		if (!err) {
	// 			this.setState({processVisible: true})
	// 			this.props.dispatch({
	// 				type: "tmsStatus/tmsStatusOpsStart",
	// 				payload: values
	// 			})
	// 		}
	// 	})
	// }
	handleFields = (fields, tmsStatus) => ({...fields, ...{tmsStatus}})
	handleClick = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({processVisible: true})
				this.props.dispatch({
					type: "tmsStatus/tmsStatusOpsStart",
					payload: this.handleFields(values, e.target.value)
				})
			}
		})
	}
	showTmsModelHandler = (e) => {
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
		this.props.dispatch({
			type: "selectTmsStatus/selection"
		})
	}
	hideTmsModelHandler = () => {
		this.setState({
			visible: false
		})
	}
	render() {
		const colProps = {
			xs: 24,
			sm: 12
		}
		const formItemLayout = {
			labelCol: {
				xs: 24,
				sm: 12
			},
			wrapperCol: {
				xs: 24,
				sm: 12
			},
			style: {
				marginBottom: 16
			}
		}
		const {children, form, tmsStatus, location, resource} = this.props
		const {getFieldDecorator, isFieldTouched, getFieldError, getFieldsError} = form
		// 初始值影响验证
		const customerCodesError = isFieldTouched("customerCodes") && getFieldError("customerCodes")
		// 初始值不影响验证
		const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])
		const processing = this.state.processVisible && tmsStatus.result === null
		return (
			<div>
				<span onClick={this.showTmsModelHandler}>
					{children}
				</span>
				<Modal
					title="TMS状态批量修改"
					okText="保存"
					style={{top: 0}}
					width="100%"
					height="100%"
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
					onCancel={this.hideTmsModelHandler}
					visible={this.state.visible}
					footer={<Button onClick={this.hideTmsModelHandler} type="primary">关闭</Button>}
				>
					<Form>
						<Row gutter={24}>
							<Col {...colProps}>
								<Form.Item
									{...formItemLayout}
									label="客户编号"
									validateStatus={customerCodesError ? "error" : ""}
									help={customerCodesError || ""}
								>
									{getFieldDecorator("customerCodes", {
										initialValue: [],
										rules: [{
											required: true,
											message: "请输入客户编号"
										}]
									})(
										<TextArea
											placeholder="请输入客户编号，用回车符分割"
											autosize={{ minRows: 6}}
										/>
									)}
								</Form.Item>
							</Col>
							<Col {...colProps}>
								<Form.Item
									{...formItemLayout}
								>
									<div onClick={this.handleClick} className={showStyles.btnBox}>
										{elementAuth(location, "TMS状态冻结", resource.currentResources)
											&& <Button type="primary" value="3" disabled={hasErrors(getFieldsError())}>冻结</Button>}
										{elementAuth(location, "TMS状态解冻", resource.currentResources)
											&& <Button type="primary" value="1" disabled={hasErrors(getFieldsError())}>解冻</Button>}
										{elementAuth(location, "TMS状态置为不活动", resource.currentResources)
											&& <Button type="primary" value="2" disabled={hasErrors(getFieldsError())}>置为不活动</Button>}
										{elementAuth(location, "TMS状态待收款", resource.currentResources)
											&& <Button type="primary" value="4" disabled={hasErrors(getFieldsError())}>待收款</Button>}
										{elementAuth(location, "TMS状态待解冻", resource.currentResources)
											&& <Button type="primary" value="5" disabled={hasErrors(getFieldsError())}>待解冻</Button>}
									</div>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
				<Modal
					visible={this.state.processVisible}
					closable={false}
					footer={!processing && <div className={showStyles.centerBtn}>
						<Button onClick={this.hideModelHandler} type="primary">确认</Button>
					</div>}
					afterClose={this.resetResult}
				>
					{processing ?
						<div className={showStyles.center}>
							<Spin spinning className={showStyles.sucIcon} size="large"/>
							<div className={showStyles.message}>正在努力修改中，请稍等...</div>
						</div>
						:
						<div className={showStyles.center}>
							<span className={tmsStatus.result && tmsStatus.result.success ?
								showStyles.sucIcon : showStyles.failIcon}>
								{tmsStatus.result && tmsStatus.result.success ? <Icon type="check-circle"/> : <Icon type="info-circle-o"/>}
							</span>
							<pre className={style.pre}>{tmsStatus.result && tmsStatus.result.message}</pre>
						</div>
					}
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = ({tmsStatus, selectTmsStatus}) => ({tmsStatus, selectTmsStatus})
export default connect(mapStateToProps)(Form.create()(FormModal))
