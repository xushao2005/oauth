import React from "react"
import styles from "./successView.less"
import image from "../../assets/caught-up.svg"

const successView = ({title, desc, imgStyle} = {title: "成功了！", desc: ""}) => (
	<div className={styles.center}>
		<img src={image} alt="successView" className={imgStyle}/>
		<p className={styles.title}>{title}</p>
		<p className={styles.desc}>{desc}</p>
	</div>
)


export default successView
