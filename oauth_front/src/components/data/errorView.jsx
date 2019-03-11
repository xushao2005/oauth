import React from "react"
import {Icon} from "antd"
import styles from "./errorView.less"

const successView = ({title, desc} = {title: "失败！", desc: ""}) => (
	<div className={styles.center}>
		<Icon type="close-circle" className={styles.icon}/>
		<p className={styles.title}>{title}</p>
		<p className={styles.desc}>{desc}</p>
	</div>
)


export default successView
