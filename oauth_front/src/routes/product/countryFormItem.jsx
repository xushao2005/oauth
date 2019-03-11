import React, {Component} from "react"
import {Input, AutoComplete} from "antd"
import {connect} from "dva"

const AOption = AutoComplete.Option
const {TextArea} = Input

class CountryFormItem extends Component {
	constructor(props) {
		super(props)
		const value = this.props.value || null
		this.state = {
			value: value.value
		}
	}
	handleSearchRegions = (value) => {
		if (!value) return
		let temp = []
		const origins = this.props.selectRegion.regions
		temp = origins.filter(it =>
			(it.chinesename && it.chinesename.indexOf(value) !== -1)
			|| (it.chinesepinyin && it.chinesepinyin.toLowerCase().indexOf(value.toLowerCase()) !== -1)
			|| (it.english2bit && it.english2bit.toLowerCase().indexOf(value.toLowerCase()) !== -1)
			|| (it.englishname && it.englishname.toLowerCase().indexOf(value.toLowerCase()) !== -1)
			|| (it.id && it.id.indexOf(value) !== -1))
		if (temp.length > 0) {
			this.props.dispatch({
				type: "selectRegion/searchReginons",
				regions: temp
			})
		} else {
			this.props.dispatch({
				type: "selectRegion/searchReginons",
				regions: []
			})
		}
	}
	handleChooseCountry = (value) => {
		let changedValue
		if (this.state.value && value) {
			changedValue = `${this.state.value}、${value}`
		} else {
			changedValue = value
		}
		this.setState({value: changedValue})
		this.triggerChange({value: changedValue})
	}
	handleInputCountries = (e) => {
		this.setState({value: e.target.value})
		this.triggerChange({value: e.target.value})
	}
	triggerChange = (values) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange
		if (onChange) {
			onChange(Object.assign({}, this.state, values))
		}
	}
	render() {
		return (
			<span>
				<TextArea value={this.state.value} onChange={this.handleInputCountries} rows={4}/>
				<AutoComplete
					allowClear
					placeholder="可输入国家名称、英文名或二字码进行检索"
					onSearch={this.handleSearchRegions}
					onSelect={this.handleChooseCountry}
					dataSource={this.props.selectRegion.searchReginons.map(item =>
						(<AOption key={item.id} value={item.chinesename}>{item.chinesename}</AOption>)
					)}
				/>
			</span>
		)
	}
}

const mapStateToProps = ({selectRegion}) => ({selectRegion})

export default connect(mapStateToProps)(CountryFormItem)
