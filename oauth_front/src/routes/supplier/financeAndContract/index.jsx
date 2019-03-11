import React, {Component} from "react"
import {Tabs} from "antd"
import PaymentInfoPage from "../financeAndContract/payment"
import RebateContractIndex from "../rebateContract/index"
import TransportContractIndex from "../transportContract/index"
import FinanceIndex from "../finance/index"
import PayAccountIndex from "../payAccount/index"

const TabPane = Tabs.TabPane
class TableView extends Component {
	onChange = (tab) => {
		const {dispatch, payload: {id}} = this.props
		if (tab === "rebateContract") {
			dispatch({
				type: "supplierRebateContract/query",
				payload: {
					supplierCode: id
				}
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: false
			})
		} else if (tab === "backAccount") {
			dispatch({
				type: "supplierFinance/query",
				payload: {
					supplierCode: id
				}
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: false
			})
		} else if (tab === "payAccount") {
			dispatch({
				type: "supplierPayAccount/query",
				payload: {
					supplierCode: id
				}
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: false
			})
		} else if (tab === "transportContract") {
			dispatch({
				type: "supplierTransportContract/query",
				payload: {
					supplierCode: id
				}
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: false
			})
		} else {
			dispatch({
				type: "selectEmployee/saveEmployees",
				payload: []
			})
			dispatch({
				type: "supplier/savePaymentTab",
				payload: true
			})
			dispatch({
				type: "supplier/saveMainTab",
				payload: true
			})
		}
	}
	render() {
		const reqProps = {location: this.props.location,
			supplierCode: this.props.payload.id}
		const paymentInfoForm = this.props.paymentInfoForm
		return (
			<Tabs defaultActiveKey="1" onChange={this.onChange}>
				<TabPane tab="财务信息" key="payment">
					<PaymentInfoPage
						ref={(child) => {
							paymentInfoForm(child)
						}}/>
				</TabPane>
				<TabPane tab="返款合同" key="rebateContract">
					<RebateContractIndex {...reqProps}/>
				</TabPane>
				<TabPane tab="合同" key="transportContract">
					<TransportContractIndex {...reqProps}/>
				</TabPane>
				<TabPane tab="银行账号" key="backAccount">
					<FinanceIndex {...reqProps}/>
				</TabPane>
				<TabPane tab="付款账号" key="payAccount">
					<PayAccountIndex {...reqProps}/>
				</TabPane>
			</Tabs>
		)
	}
}

export default TableView
