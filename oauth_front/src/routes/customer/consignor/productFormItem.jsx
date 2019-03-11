import React, {Component} from "react"
import {Input, AutoComplete} from "antd"
import {connect} from "dva"

const AOption = AutoComplete.Option
const {TextArea} = Input

class ProductFormItem extends Component {
	constructor(props) {
		super(props)
		const value = this.props.value || {}
		this.state = {
			value: value.value
		}
	}
	componentWillReceiveProps(nextProps) {
		if ("value" in nextProps) {
			const value = nextProps.value
			if (value) {
				this.setState(value)
			}
		}
	}
	handleProductChange = (e) => {
		const changedValue = {value: e.target.value}
		if (!("value" in this.props)) {
			this.setState(changedValue)
		}
		this.triggerChange(changedValue)
	}
	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue))
		}
	}
	productAutoComplete = (value) => {
		this.props.dispatch({
			type: "selectProduct/selection",
			payload: {
				p: value
			}
		})
	}
	inputProduct = (value) => {
		const old = this.state.value || ""
		let changedValue
		if (old.length === 0) {
			changedValue = {value}
		} else if (old.endsWith("、")) {
			changedValue = {value: `${old}${value}`}
		} else {
			changedValue = {value: `${old}、${value}`}
		}
		if (!("value" in this.props)) {
			this.setState(changedValue)
		}
		this.triggerChange(changedValue)
	}
	render() {
		return (
			<span>
				<TextArea
					value={this.state.value}
					onChange={this.handleProductChange}
					rows={4}/>
				<AutoComplete
					allowClear
					style={{width: "100%"}}
					placeholder="请输入产品编码或产品名称"
					dropdownMatchSelectWidth={false}
					dropdownStyle={{width: 250}}
					onSearch={this.productAutoComplete}
					onSelect={this.inputProduct}
					dataSource={this.props.selectProduct.products.map(item =>
						(<AOption key={item.productname}>{item.productname}</AOption>)
					)}
				/>
			</span>
		)
	}
}

const mapStateToProps = ({selectProduct}) => ({selectProduct})

export default connect(mapStateToProps)(ProductFormItem)
