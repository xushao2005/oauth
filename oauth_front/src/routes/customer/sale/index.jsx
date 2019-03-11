import React from "react"
import {connect} from "dva"
import ContractIndexPage from "./contract/index"
import SalesIndexPage from "./sales/index"
import ReceiverIndexPage from "./receiver/index"

const IndexPage = ({location}) => (
	<div>
		<SalesIndexPage location={location}/>
		<ReceiverIndexPage location={location}/>
		<ContractIndexPage location={location}/>
	</div>
)

const mapStateToProps = ({customerFinance}) =>
	({customerFinance})

export default connect(mapStateToProps)(IndexPage)
