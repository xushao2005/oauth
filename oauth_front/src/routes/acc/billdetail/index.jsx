import React, {Component} from "react"
import {Col, Form, Icon, Modal, Popover, Row} from "antd"
import classnames from "classnames"
import moment from "moment"
import {styles} from "../../../components/layouts"
import BillDetailBody from "./body"
import BillDetail2BillBody from "./body2bill"
import BillDetailReturnBody from "./bodyReturn"
import MoneySpan from "../common/moneySpan"

const DateFormat = "YYYY-MM-DD"
class BillDetailViewModal extends Component {
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
				type: "billdetail/query",
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
		let title = "账单明细（快件）"
		if (transbill.transType === "TC02") {
			title = "账单明细（退件）"
		}
		if (transbill.transType === "TC04") {
			title = "账单明细（二次费用）"
		}
		const baseInfo = (
			<Row>
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
						label="结账周期"
					>
						{transbill.billPeriod}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="记账日期"
					>
						{moment(transbill.refDate).format(DateFormat)}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="交易号"
					>
						{transbill.transId}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="交易类型"
					>
						{transbill.transTypeName}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="是否调整"
					>
						{transbill.isChange === "1" ? "是" : "否"}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="账单金额"
					>
						(<MoneySpan {...{money: transbill.billAmount}}/>)元
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
							<span>{title}
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
						{transbill.transType === "TC01" && <BillDetailBody
							custinf={custinf}
							transbill={transbill}
						/>}
						{transbill.transType === "TC02" && <BillDetailReturnBody
							custinf={custinf}
							transbill={transbill}
						/>}
						{transbill.transType === "TC04" && <BillDetail2BillBody
							custinf={custinf}
							transbill={transbill}
						/>}
					</Modal>
				</span>
			</span>
		)
	}
}

export default BillDetailViewModal
