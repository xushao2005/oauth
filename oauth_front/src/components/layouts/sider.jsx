import React from "react"
import styles from "./layout.less"
import {fullLogo, logo} from "../../constants/app"

const Sider = ({children, isSiderFold}) => (
	<div>
		<div className={styles.logo}>
			{!isSiderFold ? <img alt="logo" style={{width: 180}} src={fullLogo}/>
				: <img alt="logo" src={logo}/>
			}
		</div>
		{children}
	</div>
)

export default Sider
