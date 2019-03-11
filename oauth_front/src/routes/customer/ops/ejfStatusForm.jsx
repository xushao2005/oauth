import React, {Component} from "react"
import {connect} from "dva"
import {Button, Col, Form, Input, Modal, Row, Spin, Icon} from "antd"
import classnames from "classnames"
import {styles} from "../../../components/layouts"
import {handleResetFields} from "../../../utils/form"
import showStyles from "../handover/saleOrReceiver.less"
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
			type: "ejfStatus/resetResult"
		})
		const ret = this.props.ejfStatus.result
		if (ret && ret.success) {
			handleResetFields(this.props.form, {
				customerCodes: undefined,
				ejfStatus: undefined
			})
			this.props.form.validateFields()
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({processVisible: true})
				this.props.dispatch({
					type: "ejfStatus/ejfStatusOpsStart",
					payload: values
				})
			}
		})
	}
	handleFields = (fields, ejfStatus) => ({...fields, ...{ejfStatus}})
	handleClick = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({processVisible: true})
				this.props.dispatch({
					type: "ejfStatus/ejfStatusOpsStart",
					payload: this.handleFields(values, e.target.value)
				})
			}
		})
	}
	showEjfModelHandler = (e) => {
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
		})
		this.props.dispatch({
			type: "selectEjfStatus/selection"
		})
	}
	hideEjfModelHandler = () => {
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
				width: "100%",
				marginBottom: 16
			}
		}
		const {children, form, ejfStatus, location, resource} = this.props
		const {getFieldDecorator, isFieldTouched, getFieldError, getFieldsError} = form
		const customerCodesError = isFieldTouched("customerCodes") && getFieldError("customerCodes")
		const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])
		const processing = this.state.processVisible && ejfStatus.result === null
		return (
			<div>
				<span onClick={this.showEjfModelHandler}>
					{children}
				</span>
				<Modal
					title="EJF状态批量修改"
					okText="保存"
					style={{top: 0}}
					width="100%"
					height="100%"
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
					onCancel={this.hideEjfModelHandler}
					visible={this.state.visible}
					footer={<Button onClick={this.hideEjfModelHandler} type="primary">关闭</Button>}
				>
					<Form layout="inline">
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
										{elementAuth(location, "EJF状态冻结", resource.currentResources)
											&& <Button type="primary" value="2" disabled={hasErrors(getFieldsError())}>冻结</Button>}
										{elementAuth(location, "EJF状态解冻", resource.currentResources)
											&& <Button type="primary" value="1" disabled={hasErrors(getFieldsError())}>解冻</Button>}
										{elementAuth(location, "EJF状态置为活动", resource.currentResources)
											&& <Button type="primary" value="1" disabled={hasErrors(getFieldsError())}>置为活动</Button>}
										{elementAuth(location, "EJF状态置为不活动", resource.currentResources)
											&& <Button type="primary" value="0" disabled={hasErrors(getFieldsError())}>置为不活动</Button>}
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
							<p className={showStyles.message}>正在努力修改中，请稍等...</p>
						</div>
						:
						<div className={showStyles.center}>
							<span className={ejfStatus.result && ejfStatus.result.success ?
								showStyles.sucIcon : showStyles.failIcon}>
								{ejfStatus.result && ejfStatus.result.success ? <Icon type="check-circle"/> : <Icon type="info-circle-o"/>}
							</span>
							<pre className={style.pre}>{ejfStatus.result && ejfStatus.result.message}</pre>
						</div>
					}
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = ({ejfStatus, selectEjfStatus}) => ({ejfStatus, selectEjfStatus})
export default connect(mapStateToProps)(Form.create()(FormModal))
