import axios from "axios"
import lodash from "lodash"
import "babel-polyfill"

const fetch = (url, options) => {
	const {
		method = "get",
		data
	} = options

	const cloneData = lodash.cloneDeep(data)
	switch (method) {
		case "get":
			return axios.get(url, {
				params: cloneData
			})
		case "delete":
			return axios.delete(url, {
				data: cloneData
			})
		case "post":
			return axios.post(url, cloneData)
		case "put":
			return axios.put(url, cloneData)
		case "patch":
			return axios.patch(url, cloneData)
		default:
			return axios(options)
	}
}

const checkStatus = (response) => {
	if (response.status >= 200 && response.status < 300) {
		return response
	}

	const error = new Error(response.statusText)
	error.response = response
	throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const request = async (url, options) => {
	const response = await fetch(url, options)

	checkStatus(response)

	const data = await response.data

	const total = response.headers["x-total-count"]

	if (total) {
		return {data, total}
	} else {
		return {data}
	}
}

export default request
