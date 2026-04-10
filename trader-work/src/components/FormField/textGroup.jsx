// libs
import React from 'react'
import i18n from '@/utils/i18n'
import * as classnames from 'classnames'
import { Input } from 'antd'
import Button from '@/components/Button'
const { TextArea } = Input

export default class TextGroup extends React.Component{
	static defaultProps = {
		value: [''],
		type: 'text',
		MAX: 10,
		addMulti:false,
	}
	constructor(props) {
		super(props)
		this.state = {
			value: this.props.value,
		}
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			const value = nextProps.value || ['']
		  	this.setState({value})
		}
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange
		if (onChange) {
		  	onChange(changedValue)
		}
	}
	inputChange = (i, e) => {
		const v = e.target.value
		const value = this.state.value.slice()
		value[i] = v
		if (!('value' in this.props)) {
			this.setState({ value })
		}
		this.triggerChange(value)
	}
	addItem = () => {
		if (this.state.value.length < this.props.MAX) {
			const value = [...this.state.value,'']
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
		const textList = []
		const {style, disabled, MAX, placeholder, type, addMulti} = this.props
		let { value } = this.state
		value = value instanceof Array?value:[value]
		for (let i = 0; i < value.length && i < MAX;i++){
			value[i] = value[i] || ''
			if (type == 'text') {
				textList.push(
					<div className="group-row">
						<Input
							maxLength={200}	
							disabled={disabled}
							value={value[i]}
							placeholder={placeholder}
							onChange={this.inputChange.bind(this, i)}
						/>
						{value.length>1 && !disabled && addMulti ? <div className="icon-delete-outline" onClick={this.deleteItem.bind(this,i)}></div> : null}
					</div>)
			} else {
				textList.push(
					<div className="group-row">
						<TextArea
							maxLength={2000}	
							disabled={disabled}
							value={value[i]}
							placeholder={placeholder}
							onChange={this.inputChange.bind(this, i)}
						/>
						{value.length>1 && !disabled ? <div className="iconfont icon-delete-outline" onClick={this.deleteItem.bind(this,i)}></div> : null}
					</div>)
			}
		}
		return (
			<div className="form-field-group" style={style} >
				{textList}
				{this.state.value.length < MAX && !disabled && addMulti ? <Button type="solid" onClick={this.addItem}>+{i18n["general.add.tw"]}</Button> :null}
			</div>
		)
	}
}