import React, {PureComponent} from "react"
import {Form, Input, Modal, Select, Spin} from "antd"
import {connect} from "dva"
import {handleReset} from "../../../utils/form"

const Option = Select.Option

const mapStateToProps = ({supplierPayAccount, selectCurrency, loading}) =>
	({supplierPayAccount, selectCurrency, loading})

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
				type: "supplierPayAccount/view",
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
			type: "supplierPayAccount/codeExists",
			payload: {
				payAccountId: value
			}
		})
			.then((res) => {
				if (res) {
					callback()
				} else {
					callback("该付款账号编码已被使用")
				}
			})
	}

	render() {
		const {supplierPayAccount, selectCurrency, loading, form, children,
			title, entityId} = this.props
		const {currencies} = selectCurrency
		const current = entityId === undefined ? {} : supplierPayAccount.current
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
		const confirmLoading = entityId === undefined ? loading.effects["supplierPayAccount/create"]
			: loading.effects["supplierPayAccount/update"]
		const viewLoading = entityId === undefined ? false : loading.effects["supplierPayAccount/view"]
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
						{(current.payAccountId || !entityId) && <Form>
							<Form.Item
								{...formItemLayout}
								label="付款账号编码"
							>
								{getFieldDecorator("payAccountId", {
									initialValue: current.payAccountId,
									rules: [{
										required: true,
										message: "必填"
									}, {
										validator: this.checkUniqueCode
									}]
								})(<Input disabled={entityId !== undefined}/>)
								}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="付款账号名称"
							>
								{getFieldDecorator("accountName", {
									initialValue: current.accountName,
									rules: [{
										required: true,
										message: "必填"
									}, {
										type: "string",
										max: 128,
										message: "名称不能超过128个字符"
									}]
								})(<Input/>)
								}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="付款币种"
							>
								{getFieldDecorator("payCurrency", {
									initialValue: current.payCurrency,
									rules: [{
										required: true,
										message: "必填"
									}]
								})(<Select>
									{currencies.map(item =>
										(<Option key={item.name}>{item.name}</Option>)
									)}
								</Select>)
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
