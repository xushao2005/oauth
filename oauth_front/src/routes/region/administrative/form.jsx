import React from "react"
import {connect} from "dva"
import {Form, Input, Modal, Radio, Select} from "antd"
import classNames from "classnames"
import lodash from "lodash"
import {fullModalWrap} from "../../../themes/modal"
import {styles} from "../../../components/layouts"
import {patterns} from "../../../utils/form"
import {checkUniqueAdministrativeCode} from "../../../validators/administrativeDivision"

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

const mapStateToProps
	= ({administrativeDivision, selectAreaLevel, loading}) => ({
		administrativeDivision, selectAreaLevel, loading
	})

class Page extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	checkUniqueAdministrativeCodeInternal = (rule, value, callback) => {
		const {administrativeDivision, selectedKey, action, regionId} = this.props
		let id
		if (action === "update") {
			id = selectedKey
		}
		const {list} = administrativeDivision
		const values = {
			id,
			regionId,
			administrativeCode: value
		}
		checkUniqueAdministrativeCode(rule, values, callback)
			.then((_) => {
			})
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
	modalProps = {
		title: this.props.title,
		visible: true,
		okText: "保存",
		onOk: this.okHandler,
		onCancel: this.hideModelHandler,
		wrapClassName: classNames(styles.fullModal, styles.modalForm),
		...fullModalWrap
	}

	render() {
		const {
			children, loading, administrativeDivision,
			selectAreaLevel, selectedKey, form, action
		} = this.props
		const {getFieldDecorator} = form
		const {list} = administrativeDivision
		let record = {}
		let parent
		if (action === "update") {
			record = lodash.find(list, {id: selectedKey})
			if (record && record.parentId !== undefined) {
				parent = lodash.find(list, {id: record.parentId})
			}
		} else if (selectedKey !== undefined) {
			parent = lodash.find(list, {id: selectedKey})
		}
		let areaLevelSelect
		if (parent === undefined) {
			areaLevelSelect = [1, 2]
		} else if (parent.areaLevel === 1) {
			areaLevelSelect = [2, 3]
		} else if (parent.areaLevel === 2) {
			areaLevelSelect = [3]
		}
		const confirmLoading = loading.effects["administrativeDivision/create"] || loading.effects["administrativeDivision/update"]
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible &&
				<Modal
					confirmLoading={confirmLoading}
					{...this.modalProps}
				>
					<Form className={styles.modalForm}>
						{parent && <Form.Item
							{...formItemLayout}
							label="上级行政区域"
						>
							{getFieldDecorator("parentId", {
								initialValue: String(parent.id)
							})(
								<Select disabled>
									<Select.Option value={String(parent.id)}>{parent.nameCn}</Select.Option>
								</Select>)
							}
						</Form.Item>}
						<Form.Item
							{...formItemLayout}
							label="中文名"
						>
							{getFieldDecorator("nameCn", {
								initialValue: record.nameCn,
								rules: [{
									required: true,
									message: "必填"
								}, {
									max: 120,
									message: "不得大于250个字"
								}]
							})(
								<Input/>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="英文名"
						>
							{getFieldDecorator("nameEn", {
								initialValue: record.nameEn,
								rules: [{
									required: true,
									message: "必填"
								}, {
									max: 250,
									message: "不得大于250个字符"
								}]
							})(
								<Input/>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="行政区域级别"
						>
							{getFieldDecorator("areaLevel", {
								initialValue: record.areaLevel,
								rules: [{
									required: true,
									message: "必填"
								}]
							})(
								<Radio.Group disabled={action === "update"}>
									{action === "update"
										? <Radio.Button key={record.areaLevel} value={record.areaLevel}>
											{selectAreaLevel.selects[record.areaLevel]}
										</Radio.Button>
										:
										areaLevelSelect.map(key =>
											(<Radio.Button key={key} value={key}>
												{selectAreaLevel.selects[key]}
											</Radio.Button>))
									}
								</Radio.Group>)
							}
						</Form.Item>
						<Form.Item
							{...formItemLayout}
							label="行政区域编码"
						>
							{getFieldDecorator("administrativeCode", {
								initialValue: record.administrativeCode,
								rules: [{
									required: true,
									message: "必填"
								}, {
									pattern: patterns.digit,
									message: "必须为数字类型"
								}, {
									validator: this.checkUniqueAdministrativeCodeInternal
								}]
							})(
								<Input/>)
							}
						</Form.Item>
					</Form>
				</Modal>
				}
			</span>
		)
	}
}

export default connect(mapStateToProps)(Form.create()(Page))
