import React, {Component} from "react"
import {Cascader, Input, Row, Icon, Popover} from "antd"
import {connect} from "dva"
import pinyin from "chinese-to-pinyin"

class CascaderAddressI18n extends Component {
	constructor(props) {
		super(props)
		const value = this.props.value || {}
		this.state = {
			sprovince: value.sprovince,
			scity: value.scity,
			sdistrict: value.sdistrict,
			saddress: value.saddress,
			saddressCh: value.saddressCh
		}
	}

	componentWillReceiveProps(nextProps) {
		if ("value" in nextProps) {
			const value = nextProps.value
			this.setState(value)
		}
	}

	handleSaddressChange = (e) => {
		const saddress = {
			saddress: e.target.value
		}
		if (!("value" in this.props)) {
			this.setState(saddress)
		}
		this.triggerChange(saddress)
	}

	handleSaddressChChange = (e) => {
		const saddressCh = {
			saddressCh: e.target.value
		}
		if (!("value" in this.props)) {
			this.setState(saddressCh)
		}
		this.triggerChange(saddressCh)
	}

	handleCascaderChange = (cascader) => {
		const cascaderPrefix = {
			sprovince: cascader[0],
			scity: cascader[1],
			sdistrict: cascader[2] || ""
		}
		if (!("value" in this.props)) {
			this.setState(cascaderPrefix)
		}
		this.triggerChange(cascaderPrefix)
	}
	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue))
		}
	}
	syncToSaddressPinyin = () => {
		const saddressCh = this.state.saddressCh
		if (saddressCh) {
			const saddress = {saddress: pinyin(saddressCh, {noTone: true, filterChinese: true})}
			this.setState(saddress)
			this.triggerChange(saddress)
		}
	}

	render() {
		const {chinaDistrictCodes, chinaDistrictPinyinCodes} = this.props.administrativeDivision
		const state = this.state
		return (
			<span>
				<Row>
					<Cascader
						options={chinaDistrictCodes}
						placeholder="请选择省/市/区（汉字）"
						value={[state.sprovince, state.scity, state.sdistrict]}
						showSearch
						onChange={this.handleCascaderChange}
						style={{width: "32%", marginRight: "3%"}}
					/>
					<Input
						onChange={this.handleSaddressChChange}
						value={state.saddressCh}
						style={{width: "60%"}}
					/>&nbsp;<Popover content="自动转拼音">
						<Icon style={{color: "blue"}} type="retweet" onClick={this.syncToSaddressPinyin}/>
					</Popover>
				</Row>
				<Row>
					<Cascader
						options={chinaDistrictPinyinCodes}
						placeholder="请选择省/市/区（拼音）"
						value={[state.sprovince, state.scity, state.sdistrict]}
						showSearch
						onChange={this.handleCascaderChange}
						style={{width: "32%", marginRight: "3%"}}
					/>
					<Input
						onChange={this.handleSaddressChange}
						value={state.saddress}
						style={{width: "60%"}}
					/>
				</Row>
			</span>
		)
	}
}

const mapStateToProps = ({administrativeDivision}) => ({administrativeDivision})

export default connect(mapStateToProps)(CascaderAddressI18n)
