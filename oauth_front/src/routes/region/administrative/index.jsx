import React from "react"
import {connect} from "dva"
import {Button, Layout, Modal, Spin, Popconfirm} from "antd"
import classNames from "classnames"
import lodash from "lodash"
import {fullModalWrap} from "../../../themes/modal"
import {styles} from "../../../components/layouts"
import Tree from "./tree"
import Bread from "./bread"
import FormModal from "./form"
import {elementAuth} from "../../../utils/auth"

const {Header, Content} = Layout

const mapStateToProps = ({administrativeDivision, resource, loading}) =>
	({administrativeDivision, resource, loading})

class Page extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			selectedKey: undefined
		}
	}

	onSelect = (selectedKeys) => {
		if (selectedKeys.length > 0) {
			this.setState({
				selectedKey: Number(selectedKeys[0])
			})
		} else {
			this.setState({
				selectedKey: undefined
			})
		}
	}

	showModelHandler = (e) => {
		if (e) {
			e.stopPropagation()
		}
		const {dispatch, region} = this.props
		dispatch({
			type: "administrativeDivision/query",
			payload: {
				regionId: region.id
			}
		})
		dispatch({
			type: "selectAreaLevel/selection"
		})
		this.setState({
			visible: true
		})
	}
	hideModelHandler = () => {
		this.setState({
			visible: false,
			selectedKey: undefined
		})
		const {dispatch} = this.props
		dispatch({
			type: "administrativeDivision/reset"
		})
	}
	createHandler = (values) => {
		const {dispatch, region} = this.props
		dispatch({
			type: "administrativeDivision/create",
			payload: {
				regionId: region.id,
				...values
			}
		})
	}
	updateHandler = (values) => {
		const {dispatch, region} = this.props
		dispatch({
			type: "administrativeDivision/update",
			payload: {
				id: this.state.selectedKey,
				regionId: region.id,
				...values
			}
		})
	}
	deleteHandler = () => {
		const {dispatch, region} = this.props
		dispatch({
			type: "administrativeDivision/remove",
			payload: {
				id: this.state.selectedKey,
				regionId: region.id,
			}
		})
	}
	modalProps = {
		title: `${this.props.title}（${this.props.region.chinesename}）`,
		visible: true,
		onCancel: this.hideModelHandler,
		wrapClassName: classNames(styles.fullModal, styles.modalForm),
		footer: (<Button onClick={this.hideModelHandler} size="large">关闭</Button>),
		...fullModalWrap
	}

	render() {
		const {children, loading, location, resource, region, administrativeDivision} = this.props
		const {list} = administrativeDivision
		const selectedKey = this.state.selectedKey
		let currentAreaLevel
		if (selectedKey) {
			const current = lodash.find(list, {id: selectedKey})
			currentAreaLevel = current && current.areaLevel
		}
		const viewLoading = loading.effects["administrativeDivision/query"]
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				{this.state.visible &&
				<Modal
					{...this.modalProps}
				>
					<Layout>
						<Header
							style={{
								background: "#fff",
								textAlign: "right",
								top: 46,
								position: "fixed",
								width: "100%",
								zIndex: 8
							}}
						>
							<span>
								{this.state.selectedKey === undefined
									? <span style={{marginRight: 5}}>当前未选中区域</span>
									:
									<span>
										<span style={{marginRight: 5}}>
											<Bread selectedKey={this.state.selectedKey}/>
										</span>
										<Popconfirm title="确定删除？" onConfirm={this.deleteHandler}>
											{elementAuth(location, "删除行政区域", resource.currentResources)
												&& <Button style={{marginRight: 5}}>删除</Button>}
										</Popconfirm>
										<FormModal
											title="编辑行政区域"
											selectedKey={this.state.selectedKey}
											regionId={region.id}
											onOk={this.updateHandler}
											action="update"
										>
											{elementAuth(location, "编辑行政区域", resource.currentResources)
												&& <Button type="primary" style={{marginRight: 5}}>编辑</Button>}
										</FormModal>
									</span>
								}
							</span>
							{currentAreaLevel !== 3 && <FormModal
								title="新增行政区域"
								selectedKey={this.state.selectedKey}
								regionId={region.id}
								onOk={this.createHandler}
								action="new"
							>
								{elementAuth(location, "新增行政区域", resource.currentResources)
									&& <Button type="primary">新增</Button>
								}
							</FormModal>}
						</Header>
						<Content style={{background: "#fff", padding: 12, marginTop: 46}}>
							<Spin spinning={viewLoading}>
								{viewLoading ?
									"正在加载中……"
									:
									list.length === 0 ?
										"未进行行政区域规划"
										:
										<Tree onSelect={this.onSelect}/>
								}
							</Spin>
						</Content>
					</Layout>
				</Modal>
				}
			</span>
		)
	}
}

export default connect(mapStateToProps)(Page)
