import React, {Component} from "react"
import {Button, Form, Modal, Spin, Tag} from "antd"
import classnames from "classnames"
import {styles} from "../../components/layouts"
import {EFFECTIVENESS_CONSTANTS, QUOTE_TYPE_CONSTANTS} from "../../constants/product"
import style from "./view.less"

class ViewModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	getLevel1CatalogName = () => {
		const {record} = this.props
		let level1CatalogName = ""
		if (record.level1Catalog === 1) {
			level1CatalogName = "普货"
		} else if (record.level1Catalog === 2) {
			level1CatalogName = "特货"
		} else {
			level1CatalogName = ""
		}
		return level1CatalogName
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
		this.setState({
			visible: false
		})
	}
	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 4}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 18}
			},
			style: {
				margin: "16px 20px"
			}
		}
		const {children, title, record, platformType} = this.props
		let currentPlatformTypeName
		if (record.lineOff === "0" && record.platformType !== undefined) {
			const currentPlatformType = platformType.list.filter(it => it.ikey === record.platformType)
			if (currentPlatformType.length > 0) {
				currentPlatformTypeName = currentPlatformType[0].value
			}
		}
		let {viewLoading} = this.props
		if (viewLoading === undefined) {
			viewLoading = false
		}
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible && <Modal
					title={title}
					style={{top: 0}}
					width="100%"
					height="100%"
					visible={this.state.visible}
					footer={<div>
						<Button onClick={this.hideModelHandler} size="large">关闭</Button>
					</div>}
					onCancel={this.hideModelHandler}
					wrapClassName={classnames(styles.fullModal, styles.modalForm, styles.viewModal)}
				>
					<Form className={styles.modalForm}>
						<Spin spinning={viewLoading}>
							{!viewLoading &&
							<div>
								<Form.Item
									{...formItemLayout}
									label="产品编码"
								>{record.productcode}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品名称"
								>
									{record.productname}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品来源"
								>
									{record.lineOffName}
								</Form.Item>
								{record.lineOff === "0" && <Form.Item
									{...formItemLayout}
									label="平台类型"
								>
									{currentPlatformTypeName}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="产品类型"
								>
									{record.productTypeName}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品组"
								>
									{record.productGroupName}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="销售产品类型"
								>
									{record.saleProductTypeName}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="内部产品类型"
								>
									{record.innerProductTypeName}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="负责人"
								>
									{record.directorName}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="自有产品推荐级别"
								>
									{record.recommendLevel ? "非自有产品" : "自有产品"}
								</Form.Item>
								{record.calcGweight && <Form.Item
									{...formItemLayout}
									label="产品计泡系数"
								>
									{record.calcGweightRate}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="是否中邮产品"
								>
									{record.cpFlag ? "是" : "否"}
								</Form.Item>
								{record.cpFlag && <Form.Item
									{...formItemLayout}
									label="中邮类型"
								>
									{record.cpTypeName}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="是否全程"
								>
									{record.omnidistance ? "是" : "否"}
								</Form.Item>
								{record.omnidistance && <Form.Item
									{...formItemLayout}
									label="是否中邮全程"
								>
									{record.chinaPost ? "是" : "否"}
								</Form.Item>}
								<Form.Item
									{...formItemLayout}
									label="是否可追踪"
								>
									{record.track ? "全程追踪" : "半程追踪"}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否计泡"
								>
									{record.calcGweight ? "是" : "否"}
								</Form.Item>
								{record.calcGweight &&
									<Form.Item
										{...formItemLayout}
										label="产品计泡系数"
									>
										{record.calcGweightRate}
									</Form.Item>
								}
								<Form.Item
									{...formItemLayout}
									label="是否走空运"
								>
									{record.byAir ? "是" : "否"}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="时效等级"
								>
									{EFFECTIVENESS_CONSTANTS.get(record.effectiveness)}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="是否合并报价"
								>
									{QUOTE_TYPE_CONSTANTS.get(record.quoteType)}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="货品一级属性"
								>
									{this.getLevel1CatalogName()}
								</Form.Item>
								{record.level1Catalog != null &&
									<Form.Item
										{...formItemLayout}
										label="货品二级属性"
									>
										{record.level2Catalogs && record.level2Catalogs.map(item => (
											<Tag key={item}>{item}</Tag>
										))}
									</Form.Item>
								}
								<Form.Item
									{...formItemLayout}
									label="是否启用"
								>
									{record.enable ? "是" : "否"}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="产品说明"
								>
									{record.desc && <pre className={style.pre}>{record.desc}</pre>}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="通达国家"
								>
									{record.countryNames && record.countryNames.map(item => (
										<Tag key={item}>{item}</Tag>
									))}
								</Form.Item>
								<Form.Item
									{...formItemLayout}
									label="揽收仓"
								>
									{record.warehousNames && record.warehousNames.map(item => (
										<Tag key={item}>{item}</Tag>
									))}
								</Form.Item>
							</div>}
						</Spin>
					</Form>
				</Modal>}
			</span>
		)
	}
}

export default ViewModal
