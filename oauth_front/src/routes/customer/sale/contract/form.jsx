import React, {Component} from "react"
import moment from "moment"
import {Button, DatePicker, Form, Icon, Input, Modal, notification, Spin, Upload} from "antd"
import {
	checkConflictedActiveTime,
	checkUniqueContractCode
} from "../../../../validators/customer/customerContract"
import {fileApi} from "../../../../constants/api"
import {handleReset} from "../../../../utils/form"

const dateFormat = "YYYY-MM-DD"

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = () => {
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		const {record, form} = this.props
		if (record.id === undefined) {
			handleReset(form)
		}
		this.setState({
			visible: false
		})
	}
	handleFields = (fields) => {
		const {effectTime, invalidTime} = fields
		fields.effectTime = `${effectTime.format(dateFormat)} 00:00:00`
		if (invalidTime) {
			fields.invalidTime = `${invalidTime.format(dateFormat)} 00:00:00`
		}
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
		const {getFieldDecorator} = this.props.form
		const {children, title, record} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
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
		// 上传合同
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
				entityType: "customer",
				key: "customerContract"
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
						fields.contractAttatch = path
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
		// 合同编号验证
		const checkUniqueContractCodeInternal = (rule, value, callback) => {
			const id = record ? record.id : null
			const values = {
				id: id,
				contractCode: value
			}
			checkUniqueContractCode(rule, values, callback)
		}
		// 生效时间验证
		const checkConflictedActiveTimeInternal = (rule, value, callback) => {
			const {customerCode} = record
			const id = record ? record.id : null
			const values = {
				id: id,
				customerCode,
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
			return !startValue.startOf("day")
				.isBefore(endValue.startOf("day"))
		}
		const disabledEndDate = (endValue) => {
			const {getFieldsValue} = this.props.form
			const fields = getFieldsValue()
			const startValue = fields.effectTime
			if (!endValue || !startValue) {
				return false
			}
			return !endValue.startOf("day")
				.isAfter(startValue.startOf("day"))
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
					visible={this.state.visible}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
				>
					<Spin spinning={viewLoading}>
						{!viewLoading && <div>
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
										validator: checkUniqueContractCodeInternal
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
								{getFieldDecorator("contractAttatch", {
									initialValue: record.contractAttatch
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
										validator: checkConflictedActiveTimeInternal
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
										? undefined : moment(record.invalidTime)
								})(
									<DatePicker
										format={dateFormat}
										disabledDate={disabledEndDate}
										onChange={onEndChange}
									/>)
								}
							</Form.Item>
						</div>}
					</Spin>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
