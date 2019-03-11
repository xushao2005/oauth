import React, {PureComponent} from "react"
import {Form, Input, Modal, Spin} from "antd"
import {connect} from "dva"
import {handleReset, patterns} from "../../../utils/form"

const mapStateToProps = ({platformType, loading}) =>
	({platformType, loading})

class FormModal extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		if (e) e.preventDefault()
		const {entityId, dispatch} = this.props
		if (entityId) {
			dispatch({
				type: "platformType/view",
				payload: {
					id: entityId
				}
			})
		}
		this.setState({
			visible: true
		})
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				onOk(values)
				this.hideModelHandler()
			}
		})
	}
	hideModelHandler = () => {
		if (this.props.entityId === undefined) {
			handleReset(this.props.form)
		}
		this.setState({
			visible: false
		})
	}

	checkUniqueCode = (rule, value, callback) => {
		const {entityId, dispatch} = this.props
		if (entityId !== undefined) {
			callback()
			return
		}
		dispatch({
			type: "platformType/codeExists",
			payload: {
				code: value
			}
		})
			.then((res) => {
				if (res) {
					callback()
				} else {
					callback("该编码已被使用")
				}
			})
	}

	checkUniqueName = (rule, value, callback) => {
		const {entityId, dispatch} = this.props
		dispatch({
			type: "platformType/uniqueName",
			payload: {
				code: entityId,
				name: value
			}
		})
			.then((res) => {
				if (res) {
					callback()
				} else {
					callback("该名称已被使用")
				}
			})
	}

	render() {
		const {platformType, loading, form, children, title, entityId} = this.props
		const current = entityId === undefined ? {} : platformType.current
		const {getFieldDecorator} = form
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 7}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 10}
			}
		}
		const confirmLoading = entityId === undefined ? loading.effects["platformType/create"]
			: loading.effects["platformType/update"]
		const viewLoading = entityId === undefined ? false : loading.effects["platformType/view"]
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible && <Modal
					title={title}
					width={400}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					visible={this.state.visible}
					confirmLoading={confirmLoading}
				>
					<Spin spinning={viewLoading}>
						{(current.ikey || !entityId) && <Form>
							<Form.Item
								{...formItemLayout}
								label="编码"
							>
								{getFieldDecorator("ikey", {
									initialValue: String(current.ikey || ""),
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										pattern: patterns.digit,
										max: 3,
										message: "请输入数字，位数不能大于3位数"
									}, {
										validator: this.checkUniqueCode
									}]
								})(<Input disabled={entityId !== undefined}/>)
								}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="名称"
							>
								{getFieldDecorator("value", {
									initialValue: current.value,
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										max: 15,
										message: "名称不能超过15个字符"
									}, {
										validator: this.checkUniqueName
									}]
								})(<Input/>)
								}
							</Form.Item>
						</Form>}
					</Spin>
				</Modal>}
			</span>
		)
	}
}

export default connect(mapStateToProps)(Form.create()(FormModal))
