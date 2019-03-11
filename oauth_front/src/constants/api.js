export const resourceApi = {
	currentResources: "api/current/resources",
	resources: "api/resources",
	upload_json: "api/resources/upload"
}

export const authApi = {
	authModel: "api/auth/getDevModel"
}

export const roleApi = {
	roles: "api/roles",
	remove: "api/role/:id",
	create: "api/role",
	view: "api/role/:id",
	update: "api/role",
	resources: "api/role/:id/resources",
	currentRoles: "api/current/roles"
}

export const userApi = {
	users: "api/users",
	create: "api/user",
	view: "api/user/:id",
	update: "api/user",
	roles: "api/user/:id/roles",
	login: "api/login",
	logout: "api/logout",
	currentUser: "api/current/user"
}

export const fileApi = {
	filePath: "api/fileView",
	upload: "api/upload"
}

// 供应商
export const supplierApi = {
	suppliers: "api/suppliers",
	create: "api/supplier",
	remove: "api/supplier/:id",
	view: "api/supplier/:id",
	update: "api/supplier",
	updatePaymentInfo: "api/supplier/paymentInfo",
	nextCode: "api/supplier/nextCode",
	autoComplete: "api/supplier/auto-complete", // 供应商自动补全
	autoCompleteSupplierAccount: "api/supplier/autoCompleteSupplierAccount", // 供应商自动补全付款账户信息
	uniqueCode: "api/supplier/validation/unique/code",
	uniqueNameCh: "api/supplier/validation/unique/nameCh",
	uniqueBusinessLicence: "api/supplier/validation/unique/businessLicence"
}

export const supplierContractApi = {
	contracts: "api/supplier/contracts",
	create: "api/supplier/contract",
	update: "api/supplier/contract",
	view: "api/supplier/contract/:id",
	remove: "api/supplier/contract/:id",
	uniqueContractCode: "api/supplier/contract/validation/unique/contractCode",
	conflictedActiveTime: "api/supplier/contract/validation/conflicted/activeTime"
}

export const supplierFinanceApi = {
	finances: "api/supplier/finances",
	create: "api/supplier/finance",
	update: "api/supplier/finance",
	view: "api/supplier/finance/:id",
	remove: "api/supplier/finance/:id",
	uniqueAccountNumber: "api/supplier/finance/validation/unique/accountNumber"
}

export const supplierRebateContractApi = {
	contracts: "api/supplier/rebateContracts",
	create: "api/supplier/rebateContract",
	update: "api/supplier/rebateContract",
	view: "api/supplier/rebateContract/:id",
	remove: "api/supplier/rebateContract/:id",
	uniqueContractCode: "api/supplier/rebateContract/validation/unique/contractCode",
	conflictedActiveTime: "api/supplier/rebateContract/validation/conflicted/activeTime"
}

export const supplierTransportContractApi = {
	contracts: "api/supplier/transportContracts",
	create: "api/supplier/transportContract",
	update: "api/supplier/transportContract",
	view: "api/supplier/transportContract/:id",
	remove: "api/supplier/transportContract/:id",
	uniqueContractCode: "api/supplier/transportContract/validation/unique/contractCode",
	conflictedActiveTime: "api/supplier/transportContract/validation/conflicted/activeTime"
}

export const supplierAccountOptionApi = {
	query: "api/supplier/:supplierCode/pay-accounts",
	create: "api/supplier/pay-account",
	update: "api/supplier/pay-account",
	view: "api/supplier/pay-account/:id",
	remove: "api/supplier/pay-account/:id",
	codeExists: "api/supplier/pay-account/validation/code-exists"
}

export const supplierContactApi = {
	contacts: "api/supplier/contacts",
	create: "api/supplier/contact",
	update: "api/supplier/contact",
	view: "api/supplier/contact/:id",
	remove: "api/supplier/contact/:id"
}

export const accApi = {
	custinfs: "api/acc/custinfs",
	custinfExp: "api/acc/custinf/exp",
	transbills: "api/acc/transbills",
	transbillExp: "api/acc/transbill/exp",
	billdetails: "api/acc/billdetails",
	billdetailExp: "api/acc/billdetail/exp",
	openbilldetails: "api/acc/openbilldetails",
	openbilldetailExp: "api/acc/openbilldetail/exp"
}

export const accPeriodApi = {
	periodBills: "api/accPeriod/periodBills",
	resend: "api/accPeriod/resend",
	exp: "api/accPeriod/exp"
}

export const userValidationApi = {
	uniqueName: "api/validation/unique/user/name"
}

export const roleValidationApi = {
	uniqueName: "api/validation/unique/role/name"
}

export const billPeriodApi = {
	billPeriodSelection: "api/accPeriod/period/selection"
}

export const ejfStatusApi = {
	ejfStatusSelection: "api/ejf-status/selection"
}

export const tmsStatusApi = {
	tmsStatusSelection: "api/tms-status/selection"
}

export const companyApi = {
	companySelection: "api/company/selection",
}

export const payCycleApi = {
	payCycleSelection: "api/pay-cycle/selection"
}

export const currencyApi = {
	currencySelection: "api/currency/selection",
	index: "api/currencies",
	view: "api/currency/:id",
	create: "api/currency",
	update: "api/currency",
	codeExists: "api/currency/validation/code-exists",
}

export const supplierSelectApi = {
	supplierTypeSelection: "api/supplier/select/supplier-types",
	productAreaTypeSelection: "api/supplier/select/product-area-types",
	borderTypeSelection: "api/supplier/select/border-types",
	payCycleSelection: "api/supplier/select/pay-cycles",
	paymentTermSelection: "api/supplier/select/payment-terms",
	rebateTypeSelection: "api/supplier/select/rebate-types",
	selection: "api/supplier/select/bank-accounts",
	paymentCompanySelection: "api/supplier/select/payment-companies"
}

export const employeeApi = {
	salesAutoComplete: "api/sales/auto-complete",
	checksAutoComplete: "api/checks/auto-complete",
	receiptsAutoComplete: "api/receipts/auto-complete",
	employeesAutoComplete: "api/employees/auto-complete",
	employeesAutoCompleteWithNoDuty: "api/employees-all/auto-complete",
	employeesInBranchCompanyAutoComplete: "api/employees-branchCompany/auto-complete",
	employeeValidationCode: "api/employee/validation/code"
}

// 客户管理
export const customerApi = {
	get: "api/customers",
	searchByContact: "/api/customers/search-by-contact",
	searchByPlatform: "/api/customers/search-by-platform",
	view: "api/customer/:customerCode",
	update: "api/customer",
	uniqueName: "api/customer/validation/unique/customerName", // 客户名唯一验证
	validPayAccount: "api//customer/validation/payAccount", // 验证付款客户
	nextCustomerCode: "api/customer/nextCustomerCode/:wareHouseCode",
	create: "api/customer",
	init: "api/customer/init", // 客户初始化接口
	autoDefrost: "api/customer/autoDefrost", // 客户设置自动解冻接口
	enable: "api/customer/enable", // 客户启用接口
	active: "api/customer/active", // 客户活动接口
	sign: "api/customer/sign", // 客户转正接口
	lackOfIntegrity: "api/customer/:customerCode/lackOfIntegrity",
	searchByPhone: "api/customer/phone/:phone",
	saleOrReceiverOps: "api/customerOps/saleOrReceiver",
	uniqueCheckingCode: "api/customer/validation/checking/code", // 校验对账人员唯一性
	uniqueIntroduerCode: "api/customer/validation/introducer/code", // 校验介绍人唯一性
	ejfStatusOps: "api/customerOps/ejfStatus",
	ejfStatusOpsNotActive: "api/customerOps/ejfStatus/notActive", //置为不活动
	ejfStatusOpsActive: "api/customerOps/ejfStatus/active", //解冻
	ejfStatusOpsFrozen: "api/customerOps/ejfStatus/frozen", //冻结
	updateFinance: "api/customer/finance",
	tmsStatusOps: "api/customerOps/tmsStatus",
	tmsStatusOpsActive: "api/customerOps/tmsStatus/active", // 解冻
	tmsStatusOpsInActive: "api/customerOps/tmsStatus/inActive", // 置为不活动
	tmsStatusOpsFrozen: "api/customerOps/tmsStatus/frozen", // 冻结
	tmsStatusOpsWaitForRecipt: "api/customerOps/tmsStatus/waitForRecipt", // 待收款
	tmsStatusOpsWaitForDefrost: "api/customerOps/tmsStatus/waitForDefrost", // 待解冻
	mainAccounts: "api/customer/mainAccounts",
	customerExp: "api/customer/download/for/customer",
	customerServiceExp: "api/customer/download/for/customerservice",
	logs: "api/customer/logs/:customerCode",
	changeToPersonal: "api/customer/changeToPersonal", // 转个人
	changeToCompany: "api/customer/changeToCompany", // 转企业
	ejfStatusFrozen: "api/customer/frozen/:customerCode", //支持单个活动客户的冻结功能
	changelogMetric: "api/batch/employee/changelog/metric",
	changeDetailMetric: "api/batch/employee/changelog/detail/metric",
	queryChangelog: "api/batch/employee/changelogs",
	adminPhoneExists: "api/customer/validation/admin-phone-exists"
}

// 客户平台关系管理
export const customerPlatformApi = {
	get: "api/customer/:customerCode/platforms",
	create: "api/customer/platform",
	update: "api/customer/platform",
	remove: "api/customer/platform/:id",
	unique: "api/customer/validation/platform/unique",
}

// 客户付款方式管理
export const customerPaymentApi = {
	get: "api/customer/:customerCode/payments",
	create: "api/customer/payment",
	update: "api/customer/payment",
	remove: "api/customer/payment/:id",
	unitPaymentCard: "api/customer/validation/payment"
}

// 客户合同管理
export const customerContractApi = {
	get: "api/customer/:customerCode/contracts",
	create: "api/customer/contract",
	update: "api/customer/contract",
	remove: "api/customer/contract/:id",
	// 检测合同号是否重复
	uniqueContractCode: "api/customer/validation/contract/unique/contractCode",
	// 检测合同生效时间是否合法
	conflictedActiveTime: "api/customer/validation/contract/conflicted/activeTime",
}

// 客户联系人管理
export const customerContactApi = {
	get: "api/customer/:customerCode/contacts",
	update: "api/customer/contact",
	create: "api/customer/contact",
	remove: "api/customer/contact/:id",
	setDefault: "api/customer/contact/:id/setDefault",
}

// 客户发货人管理
export const customerConsignorApi = {
	get: "api/customer/:customerCode/consignors",
	update: "api/customer/consignor",
	create: "api/customer/consignor",
	remove: "api/customer/consignor/:id",
	verify: "api/customer/consignors/verify",
	setDefault: "api/customer/consignors/:id/setDefault",
}

// 客户所属公司管理
export const customerAffiliatedApi = {
	get: "api/customer/:customerCode/affiliates",
	create: "api/customer/affiliate",
	// 检测所属公司生效时间是否合法
	conflictedActiveTime: "api/customer/validation/affiliate/conflicted/activeTime",
	// 检测所属公司不能上一所属公司相同
	conflicted: "api/customer/validation/affiliate/conflicted",
}

// 客户结算公司管理
export const customerSettleApi = {
	get: "api/customer/:customerCode/settles",
	create: "api/customer/settle",
	// 检测结算公司生效时间是否合法
	conflictedActiveTime: "api/customer/validation/settle/conflicted/activeTime",
	// 检测结算公司不能上一结算公司相同
	conflicted: "api/customer/validation/settle/conflicted",
}

export const customerImportJobApi = {
	jobs: "api/customer/unsigned/import/jobs",
	items: "api/customer/unsigned/import/items/:jobId"
}

// 客户销售经理管理
export const customerSaleManagerApi = {
	get: "api/customer/:customerCode/sales",
	create: "api/customer/sale",
	// 检测销售经理生效时间是否合法
	conflictedActiveTime: "api/customer/validation/sale/conflicted/activeTime",
	// 检测销售经理不能上一销售经理相同
	conflicted: "api/customer/validation/sale/conflicted",
	uniqueCode: "api/customer/validation/sale/code",
}

// 客户收款客服管理
export const customerReceiverApi = {
	get: "api/customer/:customerCode/receivers",
	create: "api/customer/receiver",
	// 检测收款客服生效时间是否合法
	conflictedActiveTime: "api/customer/validation/receiver/conflicted/activeTime",
	// 检测收款客服不能上一收款客服相同
	conflicted: "api/customer/validation/receiver/conflicted",
	uniqueCode: "api/customer/validation/receiver/code",
}

export const platformCustomerApi = {
	page: "api/unAssociateCustomer/list",
	platforms: "api/unAssociateCustomer/platforms",
	associate: "api/unAssociateCustomer/associate/:customerCode",
	associateNewCustomer: "api/unAssociateCustomer/associate/newCustomer"
}

// 用户黑名单
export const customerBlacklistApi = {
	get: "api/blacklists/:customerCode",
	view: "api/blacklist/:id",
	create: "api/blacklist",
	update: "api/blacklist",
	remove: "api/blacklist/:id",
	verifyProductCode: "api/blacklist/validation/valid-product-code"
}

// 汇率接口
export const exchangeRateApi = {
	get: "api/exchange-rates",
	view: "api/exchange-rate/:id",
	create: "api/exchange-rate",
	update: "api/exchange-rate",
	// 检测汇率生效时间是否合法
	conflictedActiveTime: "api/exchange-rate/validation/conflicted/activeTime",
}

// 产品接口
export const productApi = {
	autoComplete: "api/product/auto-complete",
	nextCode: "api/product/nextCode",
	get: "api/products",
	create: "api/product",
	update: "api/product",
	view: "api/product/:productcode",
	uniqueCode: "api/product/validation/unique/code",
	uniqueName: "api/product/validation/unique/name",
	verifyCountryNames: "api/product/validation/valid-country-name",
	whiteBlackRule: "api/product/whiteBlackRule/:productCode",
	whiteBlackRuleCreate: "api/whiteBlackRule",
	whiteBlackRuleUpdate: "api/whiteBlackRule",
	whiteBlackRuleDelete: "api/whiteBlackRule/:id",
	verifyCustomerNames: "api/product/validation/valid-customer-code",
	exportCustomer: "api/product/download/for/whiteBlackRule"
}

// 服务接口
export const serviceApi = {
	autoComplete: "api/service/auto-complete", // 服务自动补全
	nextCode: "api/service/nextCode", // 服务编码
	get: "api/services",
	create: "api/service",
	update: "api/service",
	view: "api/service/:id",
	uniqueCode: "api/service/validation/unique/code",
	uniqueName: "api/service/validation/unique/name",
}

// 服务单元接口
export const serviceUnitApi = {
	get: "api/service-units", // 最小服务单元
}

// 带电类型
export const electricTypeApi = {
	get: "api/electric-types",
	view: "api/electric-type/:id",
	update: "api/electric-type",
	create: "api/electric-type",
	autoComplete: "api/electric-type/auto-complete",
	uniqueId: "api/electric-type/validation/unique/id",
	uniqueName: "api/electric-type/validation/unique/name"
}

// 中邮类型接口
export const chinaPostTypeApi = {
	get: "api/china-post-types",
	view: "api/china-post-type/:id",
	create: "api/china-post-type",
	update: "api/china-post-type",
	uniqueId: "api/china-post-type/validation/unique/id",
	uniqueName: "api/china-post-type/validation/unique/name"
}

// 产品类型接口
export const productTypeApi = {
	get: "api/product-types",
	view: "api/product-type/:id",
	create: "api/product-type",
	update: "api/product-type",
	uniqueId: "api/product-type/validation/unique/id",
	uniqueName: "api/product-type/validation/unique/name"
}

// 运输方式接口
export const transportModeApi = {
	get: "api/transport-modes",
	create: "api/transport-mode",
	update: "api/transport-mode",
	uniqueKey: "api/transport-mode/validation/unique/key",
	uniqueValue: "api/transport-mode/validation/unique/value"
}

// 产品组
export const productGroupApi = {
	get: "api/product-groups",
	create: "api/product-group",
	update: "api/product-group",
	uniqueKey: "api/product-group/validation/unique/key",
	uniqueValue: "api/product-group/validation/unique/value"
}

// 销售产品类型
export const saleProductTypeApi = {
	get: "api/sale-product-types",
	create: "api/sale-product-type",
	update: "api/sale-product-type",
	uniqueKey: "api/sale-product-type/validation/unique/key",
	uniqueValue: "api/sale-product-type/validation/unique/value"
}

// 内部产品类型
export const innerProductTypeApi = {
	get: "api/inner-product-types",
	create: "api/inner-product-type",
	update: "api/inner-product-type",
	uniqueKey: "api/inner-product-type/validation/unique/key",
	uniqueValue: "api/inner-product-type/validation/unique/value"
}

// 限制级类目
export const limitedCatalogApi = {
	get: "api/limited-catalogs",
	create: "api/limited-catalog",
	update: "api/limited-catalog",
	uniqueKey: "api/limited-catalog/validation/unique/key",
	uniqueValue: "api/limited-catalog/validation/unique/value"
}

// 国家接口
export const regionApi = {
	regions: "api/regions",
	create: "api/region",
	view: "api/region/:id",
	update: "api/region",
	autoComplete: "api/region/auto-complete",
	uniqueId: "api/region/validation/unique/id",
	uniqueCnName: "api/region/validation/unique/cnname",
	uniqueEnName: "api/region/validation/unique/enname"
}

// 行政区划接口
export const administrativeDivisionApi = {
	getAll: "api/region/:regionId/administrative-divisions",
	create: "api/administrative-division",
	update: "api/administrative-division",
	remove: "api/administrative-division/:id",
	ifNotExistAdministrativeCode: "api/administrative-division/if-not-exist-administrative-code",
	options: "api/administrative-division/tree"
}

// 国内区域接口
export const domesticAreaApi = {
	get: "api/domestic-areas",
	view: "api/domestic-area/:code",
	create: "api/domestic-area",
	update: "api/domestic-area",
	uniqueCode: "api/domestic-area/validation/unique/code",
	uniqueName: "api/domestic-area/validation/unique/name"
}

// 付款公司接口
export const paymentCompanyApi = {
	get: "api/payment-companies",
	view: "api/payment-company/:id",
	create: "api/payment-company",
	update: "api/payment-company",
	uniqueId: "api/payment-company/validation/unique/id",
	uniqueName: "api/payment-company/validation/unique/name"
}

// 计费项类型
export const chargeItemTypeApi = {
	get: "api/dict/charge-item-types",
	view: "api/dict/charge-item-type/:id",
	create: "api/dict/charge-item-type",
	update: "api/dict/charge-item-type",
	codeExists: "api/dict/charge-item-type/validation/code-exists",
	nameExists: "api/dict/charge-item-type/validation/name-exists"
}

// 平台类型
export const platformTypeApi = {
	get: "api/dict/platform-types",
	view: "api/dict/platform-type/:id",
	create: "api/dict/platform-type",
	update: "api/dict/platform-type",
	codeExists: "api/dict/platform-type/validation/code-exists",
	nameExists: "api/dict/platform-type/validation/name-exists"
}

export const bankApi = {
	get: "api/banks",
	view: "api/bank/:id",
	create: "api/bank",
	update: "api/bank",
	uniqueId: "api/bank/validation/unique/id",
	uniqueName: "api/bank/validation/unique/name",
	bankSelection: "api/bank/selection"
}

// 一些菜单变量
export const menus = {
	customers: "/customers"
}

export const areaLevelApi = {
	areaLevelSelection: "api/supplier/select/area-levels"
}

//服务计费维度
export const serviceCalcTypeApi = {
	serviceTypeSelection: "api/serviceCalcType/select/calc-types"
}

