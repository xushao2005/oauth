import * as productWhiteBlackRuleService from "../services/productWhiteBlackRuleService"

export default {
	namespace: "productWhiteBlackRule",
	state: {
		rules: [],
		queryRules: [],
		customerCode: undefined
	},
	reducers: {
		load(state, {payload}) {
			const {rules} = payload
			return {
				...state,
				rules
			}
		},
		queryLoad(state, {payload}) {
			const {queryRules, code} = payload
			return {
				...state,
				queryRules,
				customerCode: code
			}
		},
		clear(state) {
			return {
				...state,
				rules: []
			}
		}
	},
	effects: {
		* query({payload}, {call, put}) {
			const data = yield call(productWhiteBlackRuleService.query, payload)
			yield put({
				type: "load",
				payload: {
					rules: data.data
				}
			})
		},
		* queryByCode({payload}, {select, put}) {
			const {productWhiteBlackRule} = yield select(_ => _)
			const code = payload.code
			let realRules = []
			const separator = /\n/
			if (code) {
				if (separator.exec(code) !== null) {
					const splitCode = code.split(separator)
					splitCode.forEach((co) => {
						const tepArr = productWhiteBlackRule.rules.filter(it =>
							(it.whiteBlackListCustomers.indexOf(co) !== -1
							|| it.whiteBlackListCustomersNames.indexOf(co) !== -1))
						if (tepArr.length) {
							for (let j = 0; tepArr.length > j; j += 1) {
								if (!realRules.some(item => item.id === tepArr[j].id)) {
									realRules.push(tepArr[j])
								}
							}
						}
					})
				} else {
					realRules = productWhiteBlackRule.rules.filter(it =>
						(it.whiteBlackListCustomers.indexOf(code) !== -1
						|| it.whiteBlackListCustomersNames.indexOf(code) !== -1))
				}
				yield put({
					type: "queryLoad",
					payload: {
						queryRules: realRules,
						code
					}
				})
			} else {
				yield put({
					type: "queryLoad",
					payload: {
						queryRules: productWhiteBlackRule.rules,
						code: undefined
					}
				})
			}
		},
		* create({payload}, {call, put, take}) {
			yield call(productWhiteBlackRuleService.create, payload)
			yield put({
				type: "query",
				payload: {
					productCode: payload.productCode
				}
			})
			yield take("query/@@end")
			yield put({
				type: "queryByCode",
				payload: {
					code: payload.whiteBlackListCustomers.replace(/\n/g, "、")
				}
			})
		},
		* update({payload}, {call, put}) {
			yield call(productWhiteBlackRuleService.update, payload)
			yield put({
				type: "query",
				payload: {
					productCode: payload.productCode
				}
			})
		},
		* delete({payload}, {call, put}) {
			const {id, productCode} = payload
			yield call(productWhiteBlackRuleService.remove, {id: id})
			yield put({
				type: "query",
				payload: {
					productCode: productCode
				}
			})
		},
		* exportCustomer({payload}, {call}) {
			yield call(productWhiteBlackRuleService.exportCustomer, payload)
		}
	},
	subscriptions: {}
}
