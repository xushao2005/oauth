import React from "react"
import {Icon, Row, Badge, Spin} from "antd"
import classNames from "classnames"
import {connect} from "dva"
import styles from "./index.less"
import ContactViewPage from "./view"
import ContactFormPage from "./form"
import {elementAuth} from "../../../utils/auth"

const ContactIndexPage = ({dispatch, customerContact, loading, location, resource}) => {
	const {list, currentId, creatable} = customerContact
	const updateLoading = loading.effects["customerContact/update"]
	const createLoading = loading.effects["customerContact/create"]
	const viewLoading = loading.effects["customerContact/query"] || (updateLoading || false) || (createLoading || false)
	const contact = list.filter(item => item.id === currentId)[0]
	const changeContactView = (id) => {
		if (!creatable) {
			dispatch({
				type: "customerContact/changeCurrentId",
				payload: id
			})
		}
	}
	const showNewForm = () => {
		dispatch({
			type: "customerContact/makeCreatable"
		})
	}
	return (
		<div>
			<Spin spinning={viewLoading}>
				<Row gutter={24}>
					<div className={styles.contactsHeader}>共{list.length}个联系人</div>
					{list.map(item => (
						<div
							className={styles.contactTag}
							onClick={changeContactView.bind(null, item.id)}
							key={item.id}
						>
							<Badge dot={item.defaultContact}>
								<div className={classNames(styles.contactHeader,
									{
										[styles.defaultContact]: item.defaultContact,
										[styles.contactCurrent]: item.id === contact.id
									})}>{item.contactName}</div>
							</Badge>
						</div>
					))}
					{elementAuth(location, "新增联系人", resource.currentResources) && <div className={styles.contactTag} onClick={showNewForm} key="plus">
						<Badge>
							<div className={styles.contactPlus}><Icon type="plus"/></div>
						</Badge>
					</div>}
				</Row>
				<Row gutter={24}>
					{creatable
						? <ContactFormPage location={location}/>
						: <ContactViewPage location={location}/>}
				</Row>
			</Spin>
		</div>
	)
}

const mapStateToProps = ({customerContact, resource, loading}) =>
	({customerContact, resource, loading})

export default connect(mapStateToProps)(ContactIndexPage)
