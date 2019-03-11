import React, {Component} from "react"
import {Form, Input, Modal, Spin} from "antd"
import classnames from "classnames"
import {styles} from "../../components/layouts"
import {checkUniqueCnName, checkUniqueEnName, checkUniqueId} from "../../validators/region"
import {handleReset} from "../../utils/form"

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.resourceTree = []
		this.state = {
			visible: false
		}
	}
	showModelHandler = (e) => {
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
	okHandler = () => {
		const {form, onOk} = this.props
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
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
		const {getFieldDecorator} = this.props.form
		const {children, title, record, payload} = this.props
		const checkUniqueIdInternal = (rule, value, callback) => {
			const values = {id: value}
			checkUniqueId(rule, values, callback)
		}
		const checkUniqueCnNameInternal = (rule, value, callback) => {
			const id = payload ? payload.id : null
			const values = {
				id: id,
				chineseName: value
			}
			checkUniqueCnName(rule, values, callback)
		}
		const checkUniqueEnNameInternal = (rule, value, callback) => {
			const id = payload ? payload.id : null
			const values = {
				id: id,
				englishName: value
			}
			checkUniqueEnName(rule, values, callback)
		}
		let {confirmLoading, viewLoading, resourcesLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
		if (viewLoading === undefined) {
			viewLoading = false
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
					style={{top: 0}}
					width="100%"
					height="100%"
					confirmLoading={confirmLoading}
					visible={this.state.visible && !confirmLoading}
					okText="保存"
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm)}
				>
					<Form className={styles.modalForm}>
						<Spin spinning={viewLoading}>
							{!viewLoading &&
								<div>
									<div className={styles.formGroupTitle}>基本信息</div>
									{!record.id &&
										<Form.Item
											{...formItemLayout}
											label="国家编码"
										>
											{getFieldDecorator("id", {
												initialValue: record.id,
												rules: [{
													required: true,
													message: "必填"
												}, {
													type: "string",
													pattern: /^[\d]+$/,
													message: "必须为数字"
												}, {
													validator: checkUniqueIdInternal
												}]
											})(
												<Input/>)
											}
										</Form.Item>}
									<Form.Item
										{...formItemLayout}
										label="国家中文名称"
									>
										{getFieldDecorator("chinesename", {
											initialValue: record.chinesename,
											rules: [{
												required: true,
												message: "必填"
											}, {
												type: "string",
												pattern: /^[()\w-.\u4e00-\u9fa5]+$/,
												message: "中文名称不能含有特殊符号"
											}, {
												validator: checkUniqueCnNameInternal
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家中文拼音"
									>
										{getFieldDecorator("chinesepinyin", {
											initialValue: record.chinesepinyin
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家英文名称"
									>
										{getFieldDecorator("englishname", {
											initialValue: record.englishname,
											rules: [{
												validator: checkUniqueEnNameInternal
											}]
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家英文二字码"
									>
										{getFieldDecorator("english2bit", {
											initialValue: record.english2bit
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家中文四字简称"
									>
										{getFieldDecorator("chinese4bit", {
											initialValue: record.chinese4bit
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="速卖通二字码"
									>
										{getFieldDecorator("aliExpress2bit", {
											initialValue: record.aliExpress2bit
										})(
											<Input/>)
										}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="万邑通二字码"
									>
										{getFieldDecorator("winit2bit", {
											initialValue: record.winit2bit
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
