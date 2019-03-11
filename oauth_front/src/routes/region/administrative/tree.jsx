import React from "react"
import {connect} from "dva"
import {Tree} from "antd"

const TreeNode = Tree.TreeNode

const mapStateToProps = ({administrativeDivision}) => ({administrativeDivision})

class Page extends React.PureComponent {
	generateTree = (parents) => {
		const {administrativeDivision} = this.props
		const {list} = administrativeDivision
		return parents.map((it) => {
			const children = list.filter(child => child.parentId === it.id)
			return (
				<TreeNode
					key={it.id}
					title={it.nameCn}
				>
					{
						children.length > 0 && this.generateTree(children)
					}
				</TreeNode>
			)
		})
	}

	render() {
		const {administrativeDivision, onSelect} = this.props
		const {list} = administrativeDivision
		const level1s = list.filter(it => it.parentId === undefined)
		return (
			<span>
				<Tree onSelect={onSelect}>
					{this.generateTree(level1s)}
				</Tree>
			</span>
		)
	}
}

export default connect(mapStateToProps)(Page)
