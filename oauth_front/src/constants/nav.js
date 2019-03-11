import dynamic from "dva/dynamic"

// nav data
export const getNavData = app => [
	{
		layoutName: "AppLayout",
		layout: dynamic({
			app,
			models: () => [],
			component: () => import("../layouts/appLayout")
		}),
		children: [
			{
				name: "控制台",
				path: "/",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/index/index")
				})
			},
			{
				name: "客户管理",
				path: "/customers",
				component: dynamic({
					app,
					models: () => [
						import("../models/customer/customer"),
						import("../models/customer/customerContract"),
						import("../models/customer/customerSales"),
						import("../models/customer/customerReceiver"),
						import("../models/customer/customerPayment"),
						import("../models/customer/customerContact"),
						import("../models/customer/customerConsignor"),
						import("../models/customer/customerPlatform"),
						import("../models/customer/customerAffiliated"),
						import("../models/customer/customerSettle"),
						import("../models/customer/customerFinance"),
						import("../models/customer/customerBlacklist"),
						import("../models/customer/customerLog")
					],
					component: () => import("../routes/customer/index")
				})
			},
			{
				name: "自寄客户管理",
				path: "/customers/post-by-self",
				component: dynamic({
					app,
					models: () => [
						import("../models/customer/platformCustomer")
					],
					component: () => import("../routes/customer/platformCustomer")
				})
			},
			{
				name: "联系人搜索",
				path: "/customers/search-by-contact",
				component: dynamic({
					app,
					models: () => [
						import("../models/customer/customer"),
						import("../models/customer/customerContract"),
						import("../models/customer/customerSales"),
						import("../models/customer/customerReceiver"),
						import("../models/customer/customerPayment"),
						import("../models/customer/customerContact"),
						import("../models/customer/customerConsignor"),
						import("../models/customer/customerPlatform"),
						import("../models/customer/customerAffiliated"),
						import("../models/customer/customerSettle"),
						import("../models/customer/customerFinance"),
						import("../models/customer/customerBlacklist"),
						import("../models/customer/searchContact"),
						import("../models/customer/customerLog")
					],
					component: () => import("../routes/customer/searchContact/index")
				})
			},
			{
				name: "客服交接",
				path: "/customers/sale-or-receiver-handover",
				component: dynamic({
					app,
					models: () => [
						import("../models/customer/saleOrReceiver"),
						import("../models/customer/employeeChangelog")
					],
					component: () => import("../routes/customer/handover/saleOrReceiver")
				})
			},
			{
				name: "客户批量运维",
				path: "/customers/operations",
				component: dynamic({
					app,
					models: () => [
						import("../models/customer/tmsStatus"),
						import("../models/customer/ejfStatus"),
						import("../models/customer/customerImportJob")
					],
					component: () => import("../routes/customer/ops/operations")
				})
			},
			{
				name: "供应商管理",
				path: "/suppliers",
				component: dynamic({
					app,
					models: () => [
						import("../models/supplier/supplier"),
						import("../models/supplier/supplierContract"),
						import("../models/supplier/supplierFinance"),
						import("../models/supplier/supplierContact"),
						import("../models/supplier/supplierRebateContract"),
						import("../models/supplier/supplierPayAccount"),
						import("../models/supplier/supplierTransportContract"),
						import("../models/select/bankAccount"),
					],
					component: () => import("../routes/supplier/index")
				})
			},
			{
				name: "客户账单",
				path: "/acc/custinfs",
				component: dynamic({
					app,
					models: () => [
						import("../models/acc/custinf"),
						import("../models/acc/transbill"),
						import("../models/acc/billdetail"),
						import("../models/acc/openbilldetail")
					],
					component: () => import("../routes/acc/custinf/index")
				})
			},
			{
				name: "账单发送",
				path: "/accPeriod/periodBills",
				component: dynamic({
					app,
					models: () => [
						import("../models/select/billPeriod"),
						import("../models/acc/periodbill")
					],
					component: () => import("../routes/acc/periodbill/index")
				})
			},
			{
				name: "产品配置",
				path: "/products",
				component: dynamic({
					app,
					models: () => [
						import("../models/product"),
						import("../models/productWhiteBlackRule")
					],
					component: () => import("../routes/product/index")
				})
			},
			{
				name: "产品配置",
				path: "/services",
				component: dynamic({
					app,
					models: () => [
						import("../models/service")
					],
					component: () => import("../routes/service/index")
				})
			},
			{
				name: "汇率管理",
				path: "/exchange-rates",
				component: dynamic({
					app,
					models: () => [
						import("../models/exchangeRate")
					],
					component: () => import("../routes/exchangeRate/index")
				})
			},
			{
				name: "币种管理",
				path: "/currencies",
				component: dynamic({
					app,
					models: () => [
						import("../models/currency")
					],
					component: () => import("../routes/currency/index")
				})
			},
			{
				name: "中邮类型",
				path: "/dict/china-post-type",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/chinaPostType/index")
				})
			},
			{
				name: "产品类型",
				path: "/dict/product-type",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/productType/index")
				})
			},
			{
				name: "国家",
				path: "/dict/country",
				component: dynamic({
					app,
					models: () => [
						import("../models/region"),
						import("../models/select/areaLevel")
					],
					component: () => import("../routes/region/index")
				})
			},
			{
				name: "运输方式",
				path: "/dict/transport-mode",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/dict/transportMode/index")
				})
			},
			{
				name: "计费项类型",
				path: "/dict/charge-item-types",
				component: dynamic({
					app,
					models: () => [
						import("../models/chargeItemType")
					],
					component: () => import("../routes/dict/chargeItemType/index")
				})
			},
			{
				name: "平台类型",
				path: "/dict/platform-types",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/dict/platformType/index")
				})
			},
			{
				name: "付款公司",
				path: "/dict/payment-company",
				component: dynamic({
					app,
					models: () => [
						import("../models/paymentCompany")
					],
					component: () => import("../routes/dict/paymentCompany/index")
				})
			},
			{
				name: "产品组",
				path: "/dict/product-group",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/dict/productGroup/index")
				})
			},
			{
				name: "销售产品类型",
				path: "/dist/sale-product-type",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/dict/saleProductType/index")
				})
			},
			{
				name: "内部产品类型",
				path: "/dist/inner-product-type",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/dict/innerProductType")
				})
			},
			{
				name: "限制级产品类目",
				path: "/dist/limited-catalog",
				component: dynamic({
					app,
					models: () => [],
					component: () => import("../routes/dict/limitedCatalog")
				})
			},
			{
				name: "平台客户号搜索",
				path: "/customers/search-by-platform-code",
				component: dynamic({
					app,
					models: () => [
						import("../models/customer/customer"),
						import("../models/customer/customerContract"),
						import("../models/customer/customerSales"),
						import("../models/customer/customerReceiver"),
						import("../models/customer/customerPayment"),
						import("../models/customer/customerContact"),
						import("../models/customer/customerConsignor"),
						import("../models/customer/customerPlatform"),
						import("../models/customer/customerAffiliated"),
						import("../models/customer/customerSettle"),
						import("../models/customer/customerFinance"),
						import("../models/customer/customerBlacklist"),
						import("../models/searchByPlatformCode"),
						import("../models/customer/customerLog")
					],
					component: () => import("../routes/searchByPlatformCode")
				})
			}
		]
	}
]
