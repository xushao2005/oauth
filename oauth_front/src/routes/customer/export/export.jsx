import React, {Component} from "react"
import {Form, Modal, Spin, Tabs, Button} from "antd"
import classnames from "classnames"
import {styles} from "../../../components/layouts/index"
import {handleReset} from "../../../utils/form"
import CustomerServiceTab from "./customerServiceTab"
import CustomerTab from "./customerTab"

const TabPane = Tabs.TabPane
class FormModal extends Component {
	constructor(props) {
		super(props)
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
		handleReset(this.props.form)
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
		const {children, title, dispatch, selectEmployee, selectCompany, user} = this.props
		let {confirmLoading, viewLoading} = this.props
		if (confirmLoading === undefined) {
			confirmLoading = false
		}
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
					confirmLoading={confirmLoading}
					visible={this.state.visible && !confirmLoading}
					footer={<Button onClick={this.hideModelHandler} type="primary">关闭</Button>}
					onOk={this.okHandler}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm)}
				>
					<Spin spinning={viewLoading}>
						{!viewLoading &&
							<Tabs
								defaultActiveKey="customerService"
								onChange={this.onChangeTabs}
							>
								<TabPane tab="客服维度" key="customerService">
									<CustomerServiceTab
										dispatch={dispatch}
										selectEmployee={selectEmployee}
										selectCompany={selectCompany}
										user={user}
									/>
								</TabPane>
								<TabPane tab="客户维度" key="customer">
									<CustomerTab dispatch={dispatch}/>
								</TabPane>
							</Tabs>
						}
					</Spin>
				</Modal>
			</span>
		)
	}
}

export default Form.create()(FormModal)
