import React from "react"
import {AutoComplete, Button, Col, DatePicker, Form, Icon, Row, notification} from "antd"
import lodash from "lodash"
import {handleReset} from "../../../utils/form"
import * as openbilldetailService from "../../../services/acc/openbilldetail"

const {RangePicker} = DatePicker
const DateFormat = "YYYY-MM-DD"
const AOption = AutoComplete.Option
const FilterContent = ({dispatch, form, custinf, selectProduct,
						   onFilterChange}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
	const formItemLayout = {
		labelCol: {
			xs: 24,
			sm: 9
		},
		wrapperCol: {
			xs: 24,
			sm: 15
		},
		style: {
			marginBottom: 16
		}
	}
	const colProps = {
		xs: 24,
		sm: 12
	}
	const dateFormItemLayout = {
		labelCol: {
			xs: 24,
			sm: 6
		},
		wrapperCol: {
			xs: 24,
			sm: 18
		},
		style: {
			marginBottom: 16
		}
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const handleFields = (fields) => {
		const {calcDate} = fields
		if (calcDate.length) {
			fields.startCalcTime = calcDate[0].format(DateFormat)
			fields.endCalcTime = calcDate[1].format(DateFormat)
		}
		fields.customCode = custinf.customerCode
		const params = lodash.omit(fields, "calcDate")
		return params
	}
	const handleSubmit = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				const params = handleFields(fields)
				onFilterChange(params)
			}
		})
	}
	const handleExport = () => {
		validateFieldsAndScroll((err) => {
			if (!err) {
				const fields = getFieldsValue()
				const params = handleFields(fields)
				openbilldetailService.exp(params).then((data) => {
					const {result, url, error} = data.data
					if (result) {
						window.open(url, "top")
					} else {
						notification.warn({
							message: error
						})
					}
				})
			}
		})
	}
	const productAutoComplete = (value) => {
		dispatch({
			type: "selectProduct/selection",
			payload: {
				p: value
			}
		})
	}
	const initialCalcDate = []
	return (
		<Form layout="inline">
			<Row gutter={24}>
				<Col {...colProps}>
					<Form.Item
						{...dateFormItemLayout}
						label="快递单日期范围"
					>
						{getFieldDecorator("calcDate", {
							initialValue: initialCalcDate
						})(
							<RangePicker/>)
						}
					</Form.Item>
				</Col>
				<Col {...colProps}>
					<Form.Item
						{...formItemLayout}
						label="产品名称"
					>
						{getFieldDecorator("product")(
							<AutoComplete
								allowClear
								style={{width: 150}}
								placeholder="请输入产品"
								dropdownMatchSelectWidth={false}
								dropdownStyle={{width: 250}}
								onSearch={productAutoComplete}
								dataSource={selectProduct.products.map(item =>
									(<AOption key={item.productcode}>{item.productname}</AOption>)
								)}
							/>)
						}
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={23} offset={1} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="primary" style={{marginLeft: 8}} onClick={handleExport}><Icon type="download"/>导出Excel</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
