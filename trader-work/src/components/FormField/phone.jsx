// libs
import React from 'react'
import { Input } from 'antd'
import i18n from '@/utils/i18n'
import PhonePrefix from '@/components/PhonePrefix'
import { getTypeCountryCode } from '@/utils/language'

const inlineCountryFlagIconStyle = {
	width: 30,
	verticalAlign: 'middle',
	float: 'right',
	position: 'relative',
	top: 8
}
export default class Phone extends React.Component{
	constructor(prop) {
		super(prop)
		const value = this.props.value || {}
		console.log(1, value)
		this.state = {
			phone: value.phone || '',
			countryCode: value.countryCode,
		}
	}
	componentWillReceiveProps(nextProps) {
		// Should be a controlled component.
		if ('value' in nextProps) {
			const value = nextProps.value || {}
		  	this.setState(value)
		}
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange
		if (onChange) {
		  	onChange(Object.assign({}, this.state, changedValue))
		}
	}
	handlePhoneChange = (e) => {
		const phone = e.target.value
		if (!('value' in this.props)) {
			this.setState({ phone })
		}
		this.triggerChange({ phone })
	}
	handleCodeChange = (countryCode) => {
		if (!('value' in this.props)) {
			this.setState({ currency })
		}
		this.triggerChange({ countryCode })
	}
	getSelectedValue = () => {
		let obj = {
			item: this.refs.select.getSelectedItem(),
			inputValue: this.refs.input.getInputValue() || ''
		}
		return obj
	}
	isValid() {
		return this.refs.input.isValid() && this.refs.select.isValid()
	}
	_countryCodeFlagItemRender = (item) => {
		let bwCountryFlagURL = '//broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country'
		return (<div key={item.value} style={{ paddingRight: 5 }}>
			{item.label}
			<img style={inlineCountryFlagIconStyle} src={`${bwCountryFlagURL}/${item.value}.png`} />
		</div>)
	}
	render() {
		const p = this.props
		return (
			<Input
				style={p.style}	
				onChange={this.handlePhoneChange}
				placeholder={p.placeholder}	
				disabled={p.disabled}
				value={this.state.phone}
				addonBefore={<PhonePrefix value={this.state.countryCode} onSelect={this.handleCodeChange} disabled={p.disabled}/>}
			/>
		)
	}
}