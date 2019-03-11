import React from "react"
import {connect} from "dva"
import lodash from "lodash"

const mapStateToProps = ({administrativeDivision}) => ({administrativeDivision})

class Page extends React.PureComponent {
	generateBread = (selectedKey) => {
		const {administrativeDivision} = this.props
		const {list} = administrativeDivision
		const current = lodash.find(list, {id: selectedKey})
		if (current !== undefined) {
			let ret = current.nameCn
			if (current.parentId != null) {
				const pre = this.generateBread(current.parentId)
				ret = `${pre} / ${ret}`
			}
			return ret
		} else {
			return ""
		}
	}
	render() {
		const {selectedKey} = this.props
		return (
			<span>
				当前选择：{this.generateBread(selectedKey)}
			</span>
		)
	}
}

export default connect(mapStateToProps)(Page)
