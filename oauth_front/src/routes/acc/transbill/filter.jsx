import React from "react"
import {Button, Col, DatePicker, Form, Icon, Row, notification} from "antd"
import lodash from "lodash"
import {handleReset} from "../../../utils/form"
import * as transbillService from "../../../services/acc/transbill"

const {RangePicker} = DatePicker
const DateFormat = "YYYY-MM-DD"
const FilterContent = ({form, custinf, onFilterChange}) => {
	const {getFieldDecorator, validateFieldsAndScroll, getFieldsValue} = form
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
			width: 450,
			marginBottom: 16
		}
	}
	const handleFilterReset = () => {
		handleReset(form)
	}
	const handleFields = (fields) => {
		const {refDate} = fields
		if (refDate.length) {
			fields.startRefDate = refDate[0].format(DateFormat)
			fields.endRefDate = refDate[1].format(DateFormat)
		}
		// if (ftDate) {
		// 	fields.startFDate = ftDate.format(DateFormat)
		// 	fields.endTDate = lodash.cloneDeep(ftDate).add("days", 7).format(DateFormat)
		// }
		// if (calcDate.length) {
		// 	fields.startCalcDate = calcDate[0].format(DateFormat)
		// 	fields.endCalcDate = calcDate[1].format(DateFormat)
		// }
		fields.customCode = custinf.customerCode
		const params = lodash.omit(fields, "refDate", "ftDate", "calcDate")
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
				transbillService.exp(params).then((data) => {
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
	const initialRefDate = []
	return (
		<Form layout="inline">
			<Row gutter={24}>
				<Form.Item
					{...dateFormItemLayout}
					label="记账日期范围"
				>
					{getFieldDecorator("refDate", {
						initialValue: initialRefDate
					})(
						<RangePicker/>)
					}
				</Form.Item>
				{/*<Form.Item
					{...dateFormItemLayout}
					label="结算日期范围"
				>
					{getFieldDecorator("calcDate", {
						initialValue: initialCalcDate
					})(
						<RangePicker/>)
					}
				</Form.Item>
				<Form.Item
					{...dateFormItemLayout}
					label="账单开始日期"
				>
					{getFieldDecorator("ftDate")(
						<DatePicker
							disabledDate={disabledFtDate}
						/>)
					}
				</Form.Item>*/}
			</Row>
			<Row gutter={24} style={{marginBottom: 24}}>
				<Col span={24} style={{textAlign: "left"}}>
					<Button type="primary" onClick={handleSubmit}>查询</Button>
					<Button type="primary" style={{marginLeft: 8}} onClick={handleExport}><Icon type="download"/>导出Excel</Button>
					<Button type="ghost" style={{marginLeft: 8}} onClick={handleFilterReset}>重置</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default Form.create()(FilterContent)
