import React from "react"
import {Icon, Row, Badge, Spin} from "antd"
import classNames from "classnames"
import {connect} from "dva"
import styles from "./index.less"
import ViewPage from "./view"
import FormPage from "./form"
import {elementAuth} from "../../../utils/auth"
import ChooseConsignor from "./chooseConsignor"

const IndexPage = ({dispatch, customerConsignor, selectProduct, loading, location, resource}) => {
	const {list, autoCompleteList, selectable, currentId, creatable} = customerConsignor
	const consignors = selectable ? autoCompleteList : list
	const {products} = selectProduct
	const updateLoading = loading.effects["customerConsignor/update"]
	const createLoading = loading.effects["customerConsignor/create"]
	const viewLoading = loading.effects["customerConsignor/query"] || (updateLoading || false) || (createLoading || false)
	const consignor = list.filter(item => item.id === currentId)[0]
	const changeContactView = (id) => {
		if (!creatable) {
			dispatch({
				type: "customerConsignor/changeCurrentId",
				payload: id
			})
		}
	}
	const showNewForm = () => {
		dispatch({
			type: "customerConsignor/makeCreatable"
		})
	}
	const handleSearchConsignor = (value) => {
		if (!value) {
			dispatch({
				type: "customerConsignor/makeUnSelectable"
			})
			dispatch({
				type: "customerConsignor/changeAutoCompleteList",
				payload: []
			})
			if (list.length > 0) {
				dispatch({
					type: "customerConsignor/changeCurrentId",
					payload: list[0].id
				})
			}
		} else {
			dispatch({
				type: "selectProduct/selection",
				payload: {
					p: value
				}
			})
		}
	}
	// 可根据产品id和产品名称进行筛选
	const handleSelectConsignor = (value) => {
		// const searchConsignors = []
		const searchConsignorFromProducts = []
		list.forEach((item) => {
			if (item.products && item.products.length > 0) {
				item.products.forEach((it) => {
					if (it.productcode.indexOf(value) !== -1 || it.productname.indexOf(value) !== -1) {
						searchConsignorFromProducts.push(item)
					}
				})
			}
		})
		let searchConsignorFromDefault = []
		if (searchConsignorFromProducts.length === 0) {
			searchConsignorFromDefault = list.filter(item => item.default === true)
		}
		if (searchConsignorFromProducts.length > 0) {
			dispatch({
				type: "customerConsignor/changeAutoCompleteList",
				payload: searchConsignorFromProducts
			})
			dispatch({
				type: "customerConsignor/changeCurrentId",
				payload: searchConsignorFromProducts[0].id
			})
		} else if (searchConsignorFromProducts.length === 0 && searchConsignorFromDefault.length > 0) {
			dispatch({
				type: "customerConsignor/changeAutoCompleteList",
				payload: searchConsignorFromDefault
			})
			dispatch({
				type: "customerConsignor/changeCurrentId",
				payload: searchConsignorFromDefault[0].id
			})
		} else {
			dispatch({
				type: "customerConsignor/changeAutoCompleteList",
				payload: []
			})
		}
		if (!selectable) {
			dispatch({
				type: "customerConsignor/makeSelectable"
			})
		}
	}
	return (
		<div>
			<Spin spinning={viewLoading}>
				<Row gutter={24}>
					<ChooseConsignor
						list={list}
						consignors={consignors}
						products={products}
						handleSelectConsignor={handleSelectConsignor}
						handleSearchConsignor={handleSearchConsignor}
					/>
					{consignors.map(item => (
						<div
							className={styles.consignorTag}
							onClick={changeContactView.bind(null, item.id)}
							key={item.id}
						>
							<Badge dot={item.default}>
								<div className={classNames(styles.consignorHeader,
									{
										[styles.defaultConsignor]: item.default,
										[styles.consignorCurrent]: item.id === consignor.id
									})}>{item.sname}</div>
							</Badge>
						</div>
					))}
					{elementAuth(location, "新增发货人", resource.currentResources) && <div className={styles.consignorTag} onClick={showNewForm} key="plus">
						<Badge>
							<div className={styles.consignorPlus}><Icon type="plus"/></div>
						</Badge>
					</div>}
					{selectable && consignors.length === 0 && <span>该产品没有设置发货人</span>}
				</Row>
				<Row gutter={24}>
					{creatable
						? <FormPage location={location}/>
						: <ViewPage location={location}/>}
				</Row>
			</Spin>
		</div>
	)
}

const mapStateToProps = ({customerConsignor, selectProduct, resource, loading}) =>
	({customerConsignor, selectProduct, resource, loading})

export default connect(mapStateToProps)(IndexPage)
