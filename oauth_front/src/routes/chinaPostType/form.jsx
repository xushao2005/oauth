import React, {Component} from "react"
import {Form, Input, Modal} from "antd"
import {checkUniqueId, checkUniqueName} from "../../validators/chinaPostType"
import {handleReset, patterns} from "../../utils/form"

class FormModal extends Component {
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
		if (this.props.record.id === undefined) {
			handleReset(this.props.form)
		}
		this.setState({
			visible: false
		})
	}

	render() {
		// 表单验证函数
		const {getFieldDecorator} = this.props.form
		const {children, title, record, payload} = this.props
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 7}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 17}
			}
		}
		// 类型编号校验
		const checkUniqueIdInternal = (rule, value, callback) => {
			if (patterns.positiveInteger.test(value)) {
				const values = {id: value}
				checkUniqueId(rule, values, callback)
			} else {
				callback("必须为数字且首位不能为零")
			}
		}
		// 类型名称校验
		const checkUniqueNameInternal = (rule, value, callback) => {
			const id = payload ? payload.id : null
			const values = {
				id: id,
				name: value
			}
			checkUniqueName(rule, values, callback)
		}
		// loading 设置
		let {confirmLoading, resourcesLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (resourcesLoading === undefined) {
			resourcesLoading = false
		}

		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					width={400}
					confirmLoading={confirmLoading}
					visible={this.state.visible}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
				>
					<Form>
						{!record.id && <Form.Item
							{...formItemLayout}
							label="中邮类型编码"
						>
							{
								getFieldDecorator("id", {
									initialValue: record.id,
									rules: [{
										required: true,
										message: "必填"
									}, {
										validator: checkUniqueIdInternal
									}]
								})(<Input/>)
							}
						</Form.Item>}
						<Form.Item
							{...formItemLayout}
							label="中邮类型名称"
						>
							{
								getFieldDecorator("name", {
									initialValue: record.name,
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										pattern: /^[()\w-.\u4e00-\u9fa5]+$/,
										message: "中文名称不能含有特殊符号"
									}, {
										validator: checkUniqueNameInternal
									}]
								})(<Input/>)
							}
						</Form.Item>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
