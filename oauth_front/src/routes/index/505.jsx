import React from "react"
import {connect} from "dva"
import styles from "./505.less"

const Unauthorized = () => (
	<div>
		<div className={styles.error}>
			无权访问，请联系管理员授权
		</div>
	</div>
)

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(Unauthorized)
