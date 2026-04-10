// libs
import React from 'react'
import * as classnames from 'classnames'
import i18n from '@/utils/i18n'
import { getNation } from '@/utils/country'
import Button from '@/components/Button'
import { Select, Input } from 'antd'
const Option = Select.Option

export default class Tin extends React.Component{
	static defaultProps = {
		commonFieldWidth: 260,
		addMulti: false,
		MAX: 10,
	}
	constructor(props) {
		super(props)
		this.state = {
			value: this.props.value || [{ countryCode: '', tin: '' }],
			countryCodeArray: getNation(),
		}
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			const value = nextProps.value || [{ countryCode: '', tin: '' }]
		  	this.setState({value})
		}
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange
		if (onChange) {
		  	onChange(changedValue)
		}
	}
	selectCountryCode = (i, val) => { 
		let value = this.state.value.slice()
		if(value&&value[i]){
			value[i].countryCode = val ? val : ''
		}else{
			value[i] = { countryCode: val, tin: '' }
		}
		if (!('value' in this.props)) {
			this.setState({ value })
		}
		this.triggerChange(value)
	}
	inputChange = (i, e) => {
		const v = e.target.value
		if(v.length<50){
			const value = this.state.value.slice()
			if(value&&value[i]){
				value[i].tin = v
			}else{
				value[i] = { countryCode: '', tin: v }
			}
			if (!('value' in this.props)) {
				this.setState({ value })
			}
			this.triggerChange(value)
		}
	}
	addItem = () => {
		if (this.state.value.length < this.props.MAX) {
			const value = [...this.state.value,{countryCode:'',tin:''}]
			if (!('value' in this.props)) {
				this.setState({ value })
			}
			this.triggerChange(value)
		}
	}
	deleteItem = (i) => {
		if (this.state.value.length > 1) {
			const value = this.state.value.filter((_, index) => i !== index)
			if (!('value' in this.props)) {
				this.setState({ value })
			}
			this.triggerChange(value)
		}
	}
	render() {
		const {className, style, commonFieldWidth, disabled, placeholder, MAX, addMulti} = this.props
		const { value, countryCodeArray } = this.state
		const tinList = []
		for (let i = 0; i < value.length && i < MAX;i++){
			value[i] = value[i] || {countryCode:'',tin:''}
			tinList.push(<div key={i} className="group-row">
				<Select
					getPopupContainer={triggerNode => triggerNode.parentNode}
					disabled={disabled}
					style={{ width: '260px',display:'inline-block'}}
					value={value[i].countryCode}
					onChange={this.selectCountryCode.bind(this, i)}
				>
					<Option value="">{i18n["general.select"]}</Option>	
					{this.state.countryCodeArray.map(e => { 
						return <Option value={e.id}>{e.value}</Option>
					})}
				</Select>
				<Input
					maxLength={100}
					disabled={disabled}
					style={{ width: '260px',marginLeft:'10px' }}
					defaultValue={value[i].tin}
					value={value[i].tin}
					placeholder={placeholder}
					onChange={this.inputChange.bind(this,i)}
				/>
				{value.length>1 && !disabled ? <div className="icon-delete-outline" onClick={this.deleteItem.bind(this,i)}></div> : null}
			</div>)
		}
		return (
			<div className="form-field-group" style={{...style,width:commonFieldWidth+"px"}} >
				{tinList}
				{value.length < MAX && !disabled && addMulti ? <Button type="solid" onClick={this.addItem}>+{i18n["general.add.tw"]}</Button> :null}
			</div>
		)
	}
}