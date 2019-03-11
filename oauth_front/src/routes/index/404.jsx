import React from "react"
import {connect} from "dva"
import {Icon} from "antd"
import styles from "./404.less"

const NotFound = ({location}) => (
	<div>
		<div className={styles.error}>
			<Icon type="frown-o"/>
			<h1>404, 没有发现页面：{location.pathname}</h1>
		</div>
	</div>
)

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(NotFound)
