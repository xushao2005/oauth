import React, {Component} from "react"
import {Modal, Steps, Button} from "antd"
import classNames from "classnames"
import {routerRedux} from "dva/router"
import queryString from "query-string"
import {menus} from "../../constants/api"
import {styles} from "../../components/layouts"
import SuccessView from "../../components/data/successView"
import ConnectedCustomerEntryForm from "./step/entry"
import ConnectedCustomerForm from "./step/customer"
import ConnectedContactForm from "./step/contact"

const Step = Steps.Step

class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			initialized: false
		}
	}
	onPreviousHandler = () => {
		const form = this.stepForm.wrappedInstance
		const {dispatch, current} = this.props
		const next = current - 1
		let payload
		const values = form.getFieldsValue()
		if (current === 2) {
			payload = {
				contact: {
					...values
				},
				current: next
			}
		} else {
			payload = {
				...values,
				current: next
			}
		}
		dispatch({
			type: "customer/stepCacheCustomer",
			payload
		})
	}
	onNextHandler = () => {
		const form = this.stepForm.wrappedInstance
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const {dispatch, current} = this.props
				const next = current + 1
				let payload
				if (current === 2) {
					payload = {
						contact: {
							...values
						},
						current
					}
				} else {
					payload = {
						...values,
						current: next
					}
				}
				if (!this.state.initialized) {
					dispatch({
						type: "customer/entryToCreateCustomer",
						payload
					})
					this.setState({initialized: true})
				} else {
					dispatch({
						type: "customer/stepCacheCustomer",
						payload
					})
				}
				if (next === 3) {
					dispatch({
						type: "customer/create"
					})
				}
			}
		})
	}
	onOkHandler = () => {
		this.setState({
			visible: false,
			initialized: false
		})
		const {dispatch, payload} = this.props
		dispatch(routerRedux.replace({
			pathname: menus.customers,
			search: queryString.stringify({
				do: 1,
				signedWithYanwen: true,
				customerCode: payload.customerCode
			})
		}))
		dispatch({
			type: "customer/clearCacheCustomer"
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false,
			initialized: false
		})
		const {dispatch} = this.props
		dispatch({
			type: "customer/clearCacheCustomer"
		})
	}
	showModelHandler = (e) => {
		if (e) {
			e.stopPropagation()
		}
		const {dispatch} = this.props
		dispatch({
			type: "selectCompany/selection"
		})
		dispatch({
			type: "administrativeDivision/initSelectDistricts"
		})
		this.setState({
			visible: true
		})
	}

	render() {
		const {children, title, current} = this.props
		const listProps = {
			title: "成功",
			desc: "创建成功"
		}

		const steps = [{
			title: "初始化",
			content: <ConnectedCustomerEntryForm ref={(child) => {
				this.stepForm = child
			}}/>
		}, {
			title: "基本信息",
			content: <ConnectedCustomerForm ref={(child) => {
				this.stepForm = child
			}}/>
		}, {
			title: "联系人信息",
			content: <ConnectedContactForm ref={(child) => {
				this.stepForm = child
			}}/>
		}, {
			title: "完成",
			content: <SuccessView {...listProps}/>
		}]

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
					onCancel={this.hideModelHandler}
					footer={
						<span>
							{current === 0 && <Button onClick={this.hideModelHandler} size="large">关闭</Button>}
							{current > 0
								&& current < steps.length - 1
								&& <Button onClick={this.onPreviousHandler} size="large">上一步</Button>}
							{current < steps.length - 1
								&& <Button onClick={this.onNextHandler} size="large">下一步</Button>}
							{current === steps.length - 1
								&& <Button onClick={this.onOkHandler} size="large">完成</Button>}
						</span>
					}
					wrapClassName={classNames(styles.fullModal, styles.modalForm)}
				>
					<div>
						<Steps current={current}>
							{steps.map(item => <Step key={item.title} title={item.title}/>)}
						</Steps>
						<div className={styles.stepsContent}>{steps[current].content}</div>
					</div>
				</Modal>
			</span>
		)
	}
}

export default FormModal
