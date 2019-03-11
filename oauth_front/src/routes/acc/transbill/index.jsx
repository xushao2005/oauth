import React, {Component} from "react"
import {Col, Form, Icon, Modal, Popover, Row} from "antd"
import classnames from "classnames"
import {styles} from "../../../components/layouts"
import TransBillBody from "./body"
import OpenBillDetailViewModal from "../openbilldetail/index"
import MoneySpan from "../common/moneySpan"

class TransBillViewModal extends Component {
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
				type: "transbill/query",
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
		const {children, custinf, dispatch} = this.props

		const baseInfo = (
			<Row gutter={24} style={{maxWidth: 800}}>
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
						label="销售员"
					>
						{custinf.salesManagerName}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="对账客服"
					>
						{custinf.reconciliationClerkName}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="收款客服"
					>
						{custinf.receivableName}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="结算公司"
					>
						{custinf.settleCompanyName}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="账户余额"
					>
						(<MoneySpan {...{money: custinf.SettledBalance}}/>)元
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label="未出账单金额"
					>
						<OpenBillDetailViewModal
							title="未出账单明细"
							dispatch={dispatch}
							payload={{customCode: custinf.customerCode}}
							custinf={custinf}
						>
							<span className={styles.view}>
								(<MoneySpan {...{money: custinf.unSettledBalance}}/>) 元
							</span>
						</OpenBillDetailViewModal>
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...titleFormItemLayout}
						label={
							<span>可用金额
								<Popover placement="bottomLeft" content="可用金额=账户余额+未出账单金额">
									<Icon style={{fontSize: 12, marginLeft: 5}} type="question-circle-o"/>
								</Popover>
							</span>}
					>
						(<MoneySpan {...{money: custinf.useBalance}}/>) 元
					</Form.Item>
				</Col>
			</Row>
		)
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
				<span>
					<Modal
						title={<span>对账单信息
							<Popover placement="bottomLeft" content={baseInfo}>
								<OpenBillDetailViewModal
									title="未出账单明细"
									dispatch={dispatch}
									payload={{customCode: custinf.customerCode}}
									custinf={custinf}
								>
									<span className={styles.view}>
										(未出账单金额：<MoneySpan {...{money: custinf.unSettledBalance}}/>) 元
									</span>
								</OpenBillDetailViewModal>
								<Icon
									style={{fontSize: 12, marginLeft: 5, color: "red"}}
									type="question-circle-o"/>
							</Popover>
						</span>}
						style={{top: 0}}
						width="100%"
						height="100%"
						visible={this.state.visible}
						footer={null}
						onCancel={this.hideModelHandler}
						wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
					>
						<TransBillBody
							custinf={custinf}
						/>
					</Modal>
				</span>
			</span>
		)
	}
}

export default TransBillViewModal
