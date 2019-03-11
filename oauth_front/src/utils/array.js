/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export const getItemByKey = (array, key, keyAlias = "key") => {
	if (!(array instanceof Array)) {
		return null
	}
	const item = array.filter(_ => _[keyAlias] === key)
	if (item.length) {
		return item[0]
	} else {
		return null
	}
}
