// @flow

import lodash from "lodash"
import {getItemByKey} from "./array"

/**
 * 数组结构转成树状结构
 * @param array
 * @param id
 * @param pid
 * @param children
 */
export const makeTreeFromArray = (menus: Array<Object>, id: string = "id", pid: string = "pid", children: string = "children"): Array<Object> => {
	const data = lodash.cloneDeep(menus)
	const result = []
	const hash = []

	data.forEach((item: Object, index: number) => {
		hash[data[index][id]] = data[index]
	})

	data.forEach((item: Object) => {
		const hashVP = hash[item[pid]]
		if (hashVP) {
			if (!hashVP[children]) {
				hashVP[children] = []
			}
			hashVP[children].push(item)
		} else {
			result.push(item)
		}
	})
	return result
}

export const getAncestorKeysMap = (menuTree: Array<Object>, pidKey: string = "mpid",
																	 childrenMode: boolean = false): Object => {
	const levelMap = {}
	const children = []
	const getLevelMap = (menuTreeN: Array<Object>) => {
		menuTreeN.forEach((item: Object) => {
			if (childrenMode || item.children) {
				if (item[pidKey]) {
					levelMap[item.id] = item[pidKey]
				}
				if (item.children) {
					getLevelMap(item.children)
				} else {
					children.unshift(item.id)
				}
			}
		})
	}
	getLevelMap(menuTree)
	const ancestorKeysMap = {}
	const getParent = (index: number): Array<string> => {
		const result = [String(levelMap[index])]
		if (levelMap[result[0]]) {
			result.unshift(getParent(result[0])[0])
		}
		return result
	}
	Object.keys(levelMap).forEach((key: number) => {
		if ({}.hasOwnProperty.call(levelMap, key)) {
			if (childrenMode) {
				const isChildren = children.findIndex(
					(n: number): boolean => n.toString() === key) > -1
				if (isChildren) {
					ancestorKeysMap[key] = getParent(key)
				}
			} else {
				ancestorKeysMap[key] = getParent(key)
			}
		}
	})
	return ancestorKeysMap
}

export const getAncestorMenuKeys = (menus: Array<Object>, current: Object, pidKey: string = "mpid", idKey: string = "id"): Array<string> => {
	if (!current) {
		return []
	}
	const result = [String(current[idKey])]
	const getPath = (item: Object) => {
		if (item && item[pidKey]) {
			result.unshift(String(item[pidKey]))
			getPath(getItemByKey(menus, item[pidKey], idKey))
		}
	}
	getPath(current)
	return result
}
