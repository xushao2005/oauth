import "babel-polyfill"
import dva from "dva"
import createLoading from "dva-loading"
import "moment/locale/zh-cn"
import moment from "moment"
import {notification} from "antd"
import router from "./router"

moment.locale("zh-cn")

// 1. Initialize
const app = dva({
	...createLoading({
		effects: true
	}),
	onError(error, dispatch) {
		const response = error.response
		if (response) {
			// 如果未登陆，请转至认证页面
			if (response.status === 401) {
				dispatch({
					type: "app/saveLoggedIn"
				})
			} else if (response.status === 404) {
				notification.warn({
					message: "找不到调用的接口"
				})
			} else if (response.status === 500) {
				notification.warn({
					message: response.data.error
				})
			} else {
				notification.warn({
					message: error.message
				})
			}
		} else {
			notification.warn({
				message: error.message
			})
		}
	}
})

// 2. Model
app.model(require("./models/app"))
app.model(require("./models/auth/resource"))
app.model(require("./models/select/company"))
app.model(require("./models/select/districts"))
app.model(require("./models/administrativeDivision"))
app.model(require("./models/select/employee"))
app.model(require("./models/select/product"))
app.model(require("./models/select/service"))
app.model(require("./models/select/region"))
app.model(require("./models/select/supplier"))
app.model(require("./models/select/payCycle"))
app.model(require("./models/select/currency"))
app.model(require("./models/select/serviceUnits"))
app.model(require("./models/select/ejfStatus"))
app.model(require("./models/select/tmsStatus"))
app.model(require("./models/electricType"))
app.model(require("./models/productType"))
app.model(require("./models/chinaPostType"))
app.model(require("./models/transportMode"))
app.model(require("./models/serviceCalcType"))
app.model(require("./models/productGroup"))
app.model(require("./models/saleProductType"))
app.model(require("./models/innerProductType"))
app.model(require("./models/platformType"))
app.model(require("./models/limitedCatalog"))
app.model(require("./models/normalCatalog"))
app.model(require("./models/select/supplierType"))
app.model(require("./models/select/productAreaType"))
app.model(require("./models/select/broaderType"))
app.model(require("./models/select/supplierPayCycle"))
app.model(require("./models/select/supplierPaymentTerm"))
app.model(require("./models/select/supplierRebateType"))
app.model(require("./models/select/supplierPaymentCompany"))
app.model(require("./models/select/bank"))

// 3. Router
app.router(router)

// 4. Start
app.start("#root")
