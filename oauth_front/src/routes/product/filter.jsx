import React from "react"
import {Form, Row, Col, Input, Button, Icon, Select} from "antd"
import {handleReset, patterns} from "../../utils/form"
import {styles} from "../../components/layouts"

const Option = Select.Option
const Filter = ({
	dispatch, filter, form, expand, onFilterChange,
	chinaPostTypes,
	productTypes,
	productGroups,
	saleProductTypes,
	innerProductTypes,
	totalLevel2Catalogs,
	recommendLevels
}) => {
	const colProps = {
		xs: 24,
		sm: 8
	}
	const formItemLayout = {
		labelCol: {
			xs: 24,
			sm: 7
		},
		wrapperCol: {
			xs: 24,
			sm: 17
		},
		style: {
			marginBottom: 16
		}
	}
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const handleFilter = (values) => {
		if (values.level2Catalog && values.level2Catalog.length > 0) {
			values.level2Catalog = values.level2Catalog.join(",")
		}
		return values
	}
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				onFilterChange(handleFilter(fields))
			}
		})
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const toggle = () => {
		dispatch({
			type: "product/toggleFilter"
		})
	}
	const checkProductcode = (rule, value, callback) => {
		// if (parseInt(value, 10) <= 0) {
		// 	callback("请输入合法的产品编号")
		// }
		if (parseInt(value, 10) > 2147483647) {
			callback("请输入合法的产品编号")
		}
		callback()
	}
	return (
		<Form style={{marginBottom: 24}}>
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="产品编号"
					>
						{getFieldDecorator("productcode", {
							initialValue: filter.productcode,
							rules: [{
								pattern: patterns.digit,
								message: "请输入正确的产品编号"
							}, {
								validator: checkProductcode
							}]
						})(<Input placeholder="请输入产品编号"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="产品名称"
					>
						{getFieldDecorator("productname", {
							initialValue: filter.productname
						})(<Input placeholder="请输入产品名称"/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="产品来源"
					>
						{getFieldDecorator("lineOff", {
							initialValue: filter.lineOff
						})(
							<Select allowClear placeholder="请选择产品来源">
								<Option value="0">平台</Option>
								<Option value="1">非平台</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{display: expand ? "block" : "none"}}>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="产品类型"
					>
						{getFieldDecorator("productType", {
							initialValue: filter.productType || undefined
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择产品类型"
								allowClear
							>
								{productTypes.map(item =>
									<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="产品组"
					>
						{getFieldDecorator("productGroup", {
							initialValue: filter.productGroup
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择产品组"
								allowClear
							>
								{productGroups.map(item =>
									<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="销售产品类型"
					>
						{getFieldDecorator("saleProductType", {
							initialValue: filter.saleProductType
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择销售产品类型"
								allowClear
							>
								{saleProductTypes.map(item =>
									<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="内部产品类型"
					>
						{getFieldDecorator("innerProductType", {
							initialValue: filter.innerProductType
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择内部产品类型"
								allowClear
							>
								{innerProductTypes.map(item =>
									<Option key={item.ikey} value={String(item.ikey)}>{item.value}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="自有产品推荐级别"
					>
						{getFieldDecorator("recommendLevel", {
							initialValue: (filter.recommendLevel || "").toString() || undefined
						})(
							<Select
								allowClear
								style={{width: "100%"}}
								placeholder="选择自有产品推荐级别"
							>
								{recommendLevels.map(item =>
									<Option key={item.id}>{item.value}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否中邮"
					>
						{getFieldDecorator("cpFlag", {
							initialValue: filter.cpFlag
						})(
							<Select allowClear>
								<Option value="true">是</Option>
								<Option value="false">否</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="中邮类型"
					>
						{getFieldDecorator("chinaPostType", {
							initialValue: filter.chinaPostType
						})(
							<Select
								style={{width: "100%"}}
								placeholder="选择中邮类型"
								allowClear
							>
								{chinaPostTypes.map(item =>
									<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否全程"
					>
						{getFieldDecorator("omnidistance", {
							initialValue: filter.omnidistance
						})(
							<Select allowClear>
								<Option value="true">是</Option>
								<Option value="false">否</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否中邮全程"
					>
						{getFieldDecorator("chinaPost", {
							initialValue: filter.chinaPost
						})(
							<Select allowClear>
								<Option value="true">是</Option>
								<Option value="false">否</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否可追踪"
					>
						{getFieldDecorator("track", {
							initialValue: filter.track
						})(
							<Select allowClear>
								<Option value="true">全程追踪</Option>
								<Option value="false">半程追踪</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否计泡"
					>
						{getFieldDecorator("calcGweight", {
							initialValue: filter.calcGweight
						})(
							<Select allowClear>
								<Option value="true">是</Option>
								<Option value="false">否</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="是否启用"
					>
						{getFieldDecorator("enable", {
							initialValue: filter.enable
						})(
							<Select allowClear>
								<Option value="true">是</Option>
								<Option value="false">否</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="货品一级属性"
					>
						{getFieldDecorator("level1Catalog", {
							initialValue: (filter.level1Catalog || "").toString() || undefined
						})(
							<Select allowClear>
								<Option value="1">普货</Option>
								<Option value="2">特货</Option>
							</Select>
						)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="货品二级属性"
					>
						{getFieldDecorator("level2Catalog")(
							<Select
								allowClear
								mode="multiple"
								style={{width: "100%"}}
								placeholder="货品二级属性"
							>
								{totalLevel2Catalogs.map(item =>
									<Option key={item.ikey}>{item.value}</Option>)
								}
							</Select>
						)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col {...colProps}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
					<a className={styles.expand} onClick={toggle}>
						{expand ? "收起" : "展开"} <Icon type={expand ? "up" : "down"}/>
					</a>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(Filter)
