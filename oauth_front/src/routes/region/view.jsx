import React, {Component} from "react"
import {Form, Modal, Spin, Button} from "antd"
import classnames from "classnames"
import {styles} from "../../components/layouts"

class ViewModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		const {dispatch, payload} = this.props
		dispatch({
			type: "region/view",
			payload: payload
		})
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
		const {children, title, record} = this.props
		let {viewLoading} = this.props
		if (viewLoading === undefined) {
			viewLoading = false
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
					visible={this.state.visible}
					footer={<div>
						<Button onClick={this.hideModelHandler} size="large">关闭</Button>
					</div>}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
				>
					<Form className={styles.modalForm}>
						<Spin spinning={viewLoading}>
							{!viewLoading &&
								<div>
									<div className={styles.formGroupTitle}>基本信息</div>
									<Form.Item
										{...formItemLayout}
										label="国家编码"
									>{record.id}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家中文名称"
									>
										{record.chinesename}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家中文拼音"
									>
										{record.chinesepinyin}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家英文名称"
									>
										{record.englishname}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家英文二字码"
									>
										{record.english2bit}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="国家中文四字简称"
									>
										{record.chinese4bit}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="速卖通二字码"
									>
										{record.aliExpress2bit}
									</Form.Item>
									<Form.Item
										{...formItemLayout}
										label="万邑通二字码"
									>
										{record.winit2bit}
									</Form.Item>
								</div>}
						</Spin>
					</Form>
				</Modal>
			</span>
		)
	}
}

export default ViewModal
