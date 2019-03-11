import React, {Component} from "react"
import {
	Button,
	DatePicker,
	Form,
	Icon,
	Input,
	Modal,
	notification,
	Select,
	Spin,
	Upload
} from "antd"
import moment from "moment"
import {fileApi} from "../../../constants/api"
import {
	checkConflictedActiveTime,
	checkUniqueContractCode
} from "../../../validators/supplier/supplierRebateContract"
import {handleReset} from "../../../utils/form"

const dateFormat = "YYYY-MM-DD"
const Option = Select.Option

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
				type: "supplierRebateContract/view",
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
				entityType: "supplierRebateContract",
				key: "supplierRebateContract"
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
		const {getFieldDecorator, getFieldValue} = this.props.form
		const {children, title, record, payload, rebateTypes} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
		}
		const checkRebateTarget = (rule, value, callback) => {
			const rebateTypeCode = getFieldValue("rebateType")
			// 返款形式除抵扣运费外，其他方式必填返款对象
			if (!rebateTypeCode) {
				if (value && value.trim() !== "") {
					callback("未指定返款类型")
					return
				}
			} else if (rebateTypeCode && rebateTypeCode !== "5") {
				if (!value || value.trim() === "") {
					callback("返款对象必填")
					return
				}
			}
			callback()
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
		const onRebateTypeChange = () => {
			// 必须重置返点对象的校验结果, 否则不再触发校验
			this.props.form.resetFields(["rebateTarget"])
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
								<Form.Item
									{...formItemLayout}
									label="返款形式"
								>
									{getFieldDecorator("rebateType", {
										initialValue: String(record.rebateType || ""),
										rules: [{
											required: true,
											message: "必填"
										}]
									})(
										<Select onSelect={onRebateTypeChange}>
											{Object.keys(rebateTypes)
												.map(key => (
													<Option key={key}>
														{rebateTypes[key]}
													</Option>
												))}
										</Select>
									)
									}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="返款对象"
								>
									{getFieldDecorator("rebateTarget", {
										initialValue: record.rebateTarget,
										rules: [{
											required: true,
											message: "必填"
										}, {
											validator: checkRebateTarget
										}]
									})(
										<Input/>)
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
