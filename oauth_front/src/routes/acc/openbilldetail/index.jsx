import React, {Component} from "react"
import {Col, Form, Icon, Modal, Popover, Row} from "antd"
import classnames from "classnames"
import {styles} from "../../../components/layouts"
import OpenBillDetailBody from "./body"
import MoneySpan from "../common/moneySpan"

class OpenBillDetailViewModal extends Component {
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
				type: "openbilldetail/query",
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
		this.setState({
			visible: false
		})
	}

	render() {
		const colProps = {
			xs: 24,
			sm: 8
		}
		const titleFormItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 9}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 15}
			},
			style: {
				maxWidth: 400,
				margin: "16px auto"
			}
		}
		const {children, custinf, transbill} = this.props
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
		const baseInfo = (
			<Row style={{width: 700}}>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="客户编号"
					>
						{custinf.customerCode}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="客户姓名"
					>
						{custinf.customerName}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="未出账单金额"
					>
						(<MoneySpan {...{money: custinf.unSettledBalance}}/>) 元
					</Form.Item>
				</Col>
			</Row>
		)
		return (
			<span>
				<span onClick={this.showModelHandler}>
          			{children}
        		</span>
				<span>
					<Modal
						title={
							<span>未出账单明细
								<Popover placement="bottomLeft" content={baseInfo} title="对账单信息">
									<Icon
										style={{fontSize: 12, marginLeft: 5, color: "red"}}
										type="question-circle-o"/>
								</Popover>
							</span>
						}
						style={{top: 0}}
						width="100%"
						height="100%"
						visible={this.state.visible}
						footer={null}
						onCancel={this.hideModelHandler}
						wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
					>
						<OpenBillDetailBody
							custinf={custinf}
							transbill={transbill}
						/>
					</Modal>
				</span>
			</span>
		)
	}
}

export default OpenBillDetailViewModal
