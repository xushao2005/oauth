import React, {Component} from "react"
import {Cascader, Input} from "antd"

class CascaderAddress extends Component {
	constructor(props) {
		super(props)
		const value = this.props.value || {}
		this.state = {
			province: value.province,
			city: value.city,
			district: value.district,
			streetAddress: value.streetAddress
		}
	}

	componentWillReceiveProps(nextProps) {
		if ("value" in nextProps) {
			const value = nextProps.value
			this.setState(value)
		}
	}

	handleStreetAddressChange = (e) => {
		const streetAddress = {
			streetAddress: e.target.value
		}
		if (!("value" in this.props)) {
			this.setState(streetAddress)
		}
		this.triggerChange(streetAddress)
	}

	handleCascaderChange = (cascader) => {
		const cascaderPrefix = {
			province: cascader[0],
			city: cascader[1],
			district: cascader[2] || ""
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

	render() {
		const {options} = this.props
		const state = this.state
		return (
			<span>
				<Cascader
					options={options}
					placeholder="请选择省/市/区"
					value={[state.province, state.city, state.district]}
					showSearch
					onChange={this.handleCascaderChange}
					style={{width: "32%", marginRight: "3%"}}
				/>
				<Input
					onChange={this.handleStreetAddressChange}
					value={state.streetAddress}
					style={{width: "65%"}}
				/>
			</span>
		)
	}
}

export default CascaderAddress
