import React, {PureComponent} from "react"
import {Form, Input, Modal} from "antd"
import {connect} from "dva"
import {handleReset, patterns} from "../../utils/form"

const mapStateToProps = ({loading}) => ({loading})

class FormModal extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		if (e) e.preventDefault()
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
			type: "currency/codeExists",
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

	render() {
		const {record, loading, form, children, title, entityId} = this.props
		const current = entityId === undefined ? {} : record
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
		const confirmLoading = entityId === undefined ? loading.effects["currency/create"]
			: loading.effects["currency/update"]
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
					{(current.id || !entityId) && <Form>
						<Form.Item
							{...formItemLayout}
							label="编码"
						>
							{getFieldDecorator("id", {
								initialValue: String(current.id || ""),
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
							label="币种"
						>
							{getFieldDecorator("name", {
								initialValue: current.name,
								rules: [{
									required: true,
									message: "必填"
								}]
							})(<Input/>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="描述"
						>
							{getFieldDecorator("description", {
								initialValue: current.description
							})(<Input/>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="货币符号"
						>
							{getFieldDecorator("symbol", {
								initialValue: current.symbol
							})(<Input/>)
							}
						</Form.Item>
					</Form>}
				</Modal>}
			</span>
		)
	}
}

export default connect(mapStateToProps)(Form.create()(FormModal))
