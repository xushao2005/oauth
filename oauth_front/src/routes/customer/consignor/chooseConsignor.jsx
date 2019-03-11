import React, {Component} from "react"
import {Dropdown, Icon, Popover, Menu, AutoComplete, Tag} from "antd"
import styles from "./index.less"

class ChooseConsignor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: true,
			isDropdown: false,
			productname: null,
		}
	}
	handleClick = () => {
		this.setState({
			isDropdown: !this.state.isDropdown
		})
	}
	handleSelect = (value, record) => {
		if (value) {
			this.setState({
				visible: false,
				productname: record.props.children
			})
		}
		this.props.handleSelectConsignor(value)
	}
	hideVisible = () => {
		this.setState({
			visible: true,
			isDropdown: false,
			productname: null
		})
		this.props.handleSearchConsignor()
	}
	render() {
		const searchMenu = (
			<Menu>
				<Menu.Item key="0">
					根据产品筛选：<AutoComplete
						allowClear
						onSelect={this.handleSelect}
						onSearch={this.props.handleSearchConsignor}
						style={{width: 150, marginLeft: 10}}
					>
						{this.props.products.map(
							item => (<AutoComplete.Option key={item.productcode}>
								{item.productname}
							</AutoComplete.Option>)
						)}
					</AutoComplete>
				</Menu.Item>
			</Menu>
		)
		return (
			<span>
				{this.state.visible
					? (<span><Dropdown
						overlay={searchMenu}
						trigger={["click"]}
						visible={this.state.isDropdown}
						onClick={this.handleClick}
					>
						<div className={styles.consignorChoose}>
							<Icon type="filter"/>
							筛选&nbsp;
							<Popover content="根据产品筛选发货人">
								<Icon type="question-circle-o"/>
							</Popover>
						</div>
					</Dropdown>
					<div className={styles.consignorsHeader}>
						共{this.props.list.length}个发货人
					</div></span>)
					:
					(<Tag closable onClose={this.hideVisible}>{this.state.productname}</Tag>)
				}
			</span>
		)
	}
}

export default ChooseConsignor
