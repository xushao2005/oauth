import React from "react"
import {connect} from "dva"
import {Card, Col, Row} from "antd"
import style from "./operations.less"
import EjfFormModal from "./ejfStatusForm"
import TmsFormModal from "./tmsStatusForm"
import ImpotUnsigndeCustomerModal from "./import/index"
import {elementAuth} from "../../../utils/auth"

const IndexPage = ({location, resource}) => {
	const colProps = {
		xs: 24,
		sm: 8,
		style: {
			marginBottom: 16
		}
	}
	const childProps = {
		location,
		resource
	}
	return (
		<div className="content-inner">
			<Row gutter={24}>
				{elementAuth(location, "TMS状态批量修改", resource.currentResources) && <Col {...colProps}>
					<TmsFormModal {...childProps}>
						<Card className={style.card}>
							<a>TMS状态批量修改</a>
						</Card>
					</TmsFormModal>
				</Col>}
				{elementAuth(location, "EJF状态批量修改", resource.currentResources) && <Col {...colProps}>
					<EjfFormModal {...childProps}>
						<Card className={style.card}>
							<a>EJF状态批量修改</a>
						</Card>
					</EjfFormModal>
				</Col>}
				{elementAuth(location, "批量创建非正式客户", resource.currentResources) && <Col {...colProps}>
					<ImpotUnsigndeCustomerModal {...childProps}>
						<Card className={style.card}>
							<a>批量创建非正式客户</a>
						</Card>
					</ImpotUnsigndeCustomerModal>
				</Col>}
			</Row>
		</div>
	)
}

const mapStateToProps = ({resource, loading}) => ({resource, loading})

export default connect(mapStateToProps)(IndexPage)
