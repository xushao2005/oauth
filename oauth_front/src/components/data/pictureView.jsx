import React, {Component} from "react"
import {Modal} from "antd"
import {fileApi} from "../../constants/api"

const getHttpPath = (previewImage) => {
	if (!previewImage) {
		return previewImage
	} else if (previewImage.startsWith("http")) {
		return previewImage
	} else {
		return `${fileApi.filePath}/${previewImage}`
	}
}

class PictureView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	showModelHandler = (e) => {
		if (e) {
			e.stopPropagation()
		}
		const {previewImage} = this.props
		if (previewImage && previewImage.length > 0) {
			this.setState({
				visible: true
			})
		}
	}
	hideModelHandler = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		const {children, title, previewImage} = this.props
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{children}
				</span>
				<Modal
					title={title}
					visible={this.state.visible}
					footer={null}
					onCancel={this.hideModelHandler}
				>
					<img alt="" style={{width: "100%"}} src={getHttpPath(previewImage)}/>
				</Modal>
			</span>
		)
	}
}

export default PictureView
