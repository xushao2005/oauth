import React, {Component} from "react"
import {Form, Input, Modal, Spin, DatePicker, Upload, Button, Icon, notification} from "antd"
import moment from "moment"
import {fileApi} from "../../../constants/api"
import {checkUniqueContractCode, checkConflictedActiveTime} from "../../../validators/supplier/supplierContract"
import {handleReset} from "../../../utils/form"

const dateFormat = "YYYY-MM-DD"

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		if (payload) {
			dispatch({
				type: "supplierContract/view",
				payload: payload
			})
		}
		if (e) {
			e.stopPropagation()
		}
		this.setState({
			visible: true
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
	handleFields = (fields) => {
		const {effectTime, invalidTime} = fields
		fields.effectTime = `${effectTime.format(dateFormat)} 00:00:00`
		fields.invalidTime = `${invalidTime.format(dateFormat)} 00:00:00`
		return fields
	}
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.handleFields(values)
				onOk(values)
				this.hideModelHandler()
			}
		})
	}

	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 4}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 20}
			},
			style: {
				maxWidth: 600,
				margin: "16px auto"
			}
		}

		const form = this.props.form
		const importProps = {
			showUploadList: false,
			multiple: false,
			name: "attach",
			action: `${fileApi.upload}`,
			headers: {
				authorization: "authorization-text"
			},
			data: {
				entityType: "supplierContract",
				key: "supplierContract"
			},
			beforeUpload(file) {
				const isWord = file.name.endsWith(".doc") || file.name.endsWith(".docx")
				if (!isWord) {
					notification.error({
						message: "错误",
						description: "仅支持上传Word文件"
					})
				}
				return isWord
			},
			onChange(info) {
				if (info.file.status === "done") {
					const resp = info.file.response
					if (resp.success) {
						const path = resp.data
						const {getFieldsValue, setFieldsValue} = form
						const fields = getFieldsValue()
						fields.contractAttach = path
						setFieldsValue(fields)
						notification.info({
							message: "上传成功"
						})
					} else {
						notification.info({
							message: "上传失败"
						})
					}
				} else if (info.file.status === "error") {
					notification.error({
						message: "上传失败"
					})
				}
			}
		}
		const {getFieldDecorator} = this.props.form
		const {children, title, record, payload} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		const checkUniqueContractCodeInter = (rule, value, callback) => {
			const id = payload ? payload.id : null
			const values = {
				id: id,
				contractCode: value
			}
			checkUniqueContractCode(rule, values, callback)
		}
		const checkConflictedActiveTimeInter = (rule, value, callback) => {
			const {supplierCode} = record
			const id = payload ? payload.id : null
			const values = {
				id: id,
				supplierCode,
				effectTime: value ? value.format(dateFormat) : undefined
			}
			checkConflictedActiveTime(rule, values, callback)
		}
		const disabledStartDate = (startValue) => {
			const {getFieldsValue} = this.props.form
			const fields = getFieldsValue()
			const endValue = fields.invalidTime
			if (!startValue || !endValue) {
				return false
			}
			return !startValue.startOf("day").isBefore(endValue.startOf("day"))
		}
		const disabledEndDate = (endValue) => {
			const {getFieldsValue} = this.props.form
			const fields = getFieldsValue()
			const startValue = fields.effectTime
			if (!endValue || !startValue) {
				return false
			}
			return !endValue.startOf("day").isAfter(startValue.startOf("day"))
		}
		const onStartChange = (value) => {
			const {getFieldsValue, setFieldsValue} = this.props.form
			const fields = getFieldsValue()
			fields.effectTime = value
			setFieldsValue(fields)
		}
		const onEndChange = (value) => {
			const {getFieldsValue, setFieldsValue} = this.props.form
			const fields = getFieldsValue()
			fields.invalidTime = value
			setFieldsValue(fields)
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					width={500}
					confirmLoading={confirmLoading}
					visible={this.state.visible && !confirmLoading}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
				>
					<Form>
						<Spin spinning={viewLoading}>
							{!viewLoading &&
							<div>
								<Form.Item
									{...formItemLayout}
									label="合同编号"
								>
									{getFieldDecorator("contractCode", {
										initialValue: record.contractCode,
										rules: [{
											required: true,
											message: "必填"
										}, {
											validator: checkUniqueContractCodeInter
										}]
									})(
										<Input/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="合同附件"
								>
									<Upload {...importProps}>
										<Button type="primary">
											<Icon type="upload"/> 上传合同附件(*.doc\*.docx)
										</Button>
									</Upload>
								</Form.Item>
								<Form.Item
									style={{display: "none"}}
								>
									{getFieldDecorator("contractAttach", {
										initialValue: record.contractAttach
									})(
										<Input/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="生效时间"
								>
									{getFieldDecorator("effectTime", {
										initialValue: record.effectTime === undefined
											? undefined : moment(record.effectTime),
										rules: [{
											required: true,
											message: "必填"
										}, {
											validator: checkConflictedActiveTimeInter
										}]
									})(
										<DatePicker
											format={dateFormat}
											disabledDate={disabledStartDate}
											onChange={onStartChange}
										/>)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="失效时间"
								>
									{getFieldDecorator("invalidTime", {
										initialValue: record.invalidTime === undefined
											? undefined : moment(record.invalidTime),
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<DatePicker
											format={dateFormat}
											disabledDate={disabledEndDate}
											onChange={onEndChange}
										/>)
									}
								</Form.Item>
							</div>
							}
						</Spin>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
