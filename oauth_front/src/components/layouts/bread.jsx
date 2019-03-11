import React from "react"
import {Breadcrumb, Icon} from "antd"
import {Link} from "dva/router"
import {getItemByKey} from "../../utils/array"
import styles from "./bread.less"

const Bread = ({menus, currentMenu}) => {
	// 匹配当前路由
	const pathArray = []

	const getPathArray = (item) => {
		pathArray.unshift(item)
		if (item.bpid) {
			getPathArray(getItemByKey(menus, item.bpid, "id"))
		}
	}

	if (!currentMenu) {
		pathArray.push(menus[0])
		pathArray.push({
			id: 404,
			name: "Not Found"
		})
	} else {
		getPathArray(currentMenu)
	}
	// 递归查找父级
	const breads = pathArray.map((item, key) => {
		const content = (
			<span>{item.icon && <Icon type={item.icon} style={{marginRight: 4}}/>}{item.name}</span>
		)
		return (
			<Breadcrumb.Item key={item.id}>
				{(item.router && (pathArray.length - 1) !== key)
					? <Link
						to={item.router}
						replace={currentMenu && item.id === currentMenu.id}
					>
						{content}
					</Link>
					: content}
			</Breadcrumb.Item>
		)
	})

	return (
		<div className={styles.bread}>
			<Breadcrumb>
				{breads}
			</Breadcrumb>
		</div>
	)
}

export default Bread
