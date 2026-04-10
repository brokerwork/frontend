// libs
import React from 'react'
import { Select } from 'antd'
import i18n from '@/utils/i18n'
import { getCountry, getNationObject } from '@/utils/country'
import './city.less'
const Option = Select.Option

const inlineCountryFlagIconStyle = {
	width: 30,
	verticalAlign: 'middle',
	float: 'right',
	position: 'relative',
	top: 8
}
const COUNTRY_PID = '0'
export default class City extends React.Component{
	cacheData = null
	countryData = []
	constructor(prop) {
		super(prop)
		const value = this.props.value || {}
		let tempProvince = []
		let tempCity = []
		if (!this.cacheData) { 
			let tempData = {}
			let allData = getCountry() || []
			let nationObj = getNationObject()
			allData.forEach((item) => { 
				if (!tempData[item.pid]) {
					tempData[item.pid] = []
				}
				if (item.pid != COUNTRY_PID || nationObj[item.id]) {
					tempData[item.pid].push({
						id: item.id,
						value: item.value,
					})
				}
			})
			this.cacheData = tempData
			this.countryData = this.cacheData[COUNTRY_PID] || []
			if (value.country) { 
				tempProvince = this.cacheData[value.country] || []
			}
			if (value.province) { 
				tempCity = this.cacheData[value.province] || []
			}
		}
		this.state = {
			country: value.country || '',
			province: value.province || '',
			city: value.city || '',
			provinceData: tempProvince,
			cityData: tempCity,
		}
	}
	componentDidMount(){
		console.log(' ilike ha', this.props.value, this.props)
		if(!this.props.value){
			const country = this.props.defaultValue
			this.setState({
				country,
				provinceData: this.cacheData[country] || [],
				cityData: []
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
		  const value = nextProps.value
		  this.setState(value)
		}
	}
	//	排序
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange
		onChange && onChange(Object.assign({}, {
			country: this.state.country,
			province: this.state.province,
			city: this.state.city,
		}, changedValue))
	}
	countryChange = (country) => {
		if (!('value' in this.props)) {
			this.setState({ country })
		}
		this.triggerChange({ country, province: '', city: '' })
		if (country) {
			this.setState({
				provinceData: this.cacheData[country] || [],
				cityData: []
			})
		} else { 
			this.setState({
				provinceData: [],
				cityData: []
			})
		}
	}
	provinceChange = (province) => { 
		this.triggerChange({ province, city: '' })
		if (province) {
			this.setState({
				cityData: this.cacheData[province] || [],
			})
		} else { 
			this.setState({
				cityData: [],
			})
		}
	}
	cityChange = (city) => { 
		this.triggerChange({ city })
	}
	render() {
		const p = this.props
		const { country, province, city, provinceData, cityData } = this.state
		let defaultValue = ''
		return (
			<div style={p.style} className="city-wrap">
				<Select
					showSearch
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					getPopupContainer={triggerNode => triggerNode.parentNode}
					value={country||p.defaultValue}
					dropdownMatchSelectWidth={false}
					onChange={this.countryChange}
					disabled={p.disabled}>
					<Option value=''>{i18n['general.select']}</Option>
					{
						this.countryData.map((item, index) => { 
							return <Option key={index} value={item.id}>{item.value}</Option>
						})
					}
				</Select>
				<Select
					showSearch
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					getPopupContainer={triggerNode => triggerNode.parentNode}
					value={province}	
					onChange={this.provinceChange}
					dropdownMatchSelectWidth={false}
					disabled={p.disabled}>
					<Option value=''>{i18n['general.select']}</Option>
					{
						provinceData.map((item, index) => { 
							return <Option key={index} value={item.id}>{item.value}</Option>
						})
					}
				</Select>
				<Select
					showSearch
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					getPopupContainer={triggerNode => triggerNode.parentNode}
					value={city}	
					onChange={this.cityChange}	
					dropdownMatchSelectWidth={false}
					disabled={p.disabled}>
					<Option value=''>{i18n['general.select']}</Option>
					{
						cityData.map((item, index) => { 
							return <Option key={index} value={item.id}>{item.value}</Option>
						})
					}
				</Select>
			</div>
		)
	}
}