import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import css from './index.less';
import downIcon from 'images/icon_phoneDown.png';

let style = {
	width: "100%",
	height: pxToRem(100),
	lineHeight: pxToRem(100),
	top: 0,
	left: 0,
	position: 'absolute'
}

let menuItemStyle = {
	color: "pink"
}

let labelStyle = {
	top: '50%',
	color: '#00A3FE',
	left: pxToRem(175),
	position: 'absolute',
	fontSize: fontSizeByDPR(30),
	transform: 'translateY(-50%)',
	borderTop: '1px solid transparent',
}

let selectedMenuItemStyle = {
	color: "#00A3FE"
}

let underlineStyle = {
	bottom: 0
}

let errorStyle = {
	position: 'absolute',
	bottom: '-14px',
	left: pxToRem(30)
}

let hintStyle = {
	left: pxToRem(175),
	fontSize: fontSizeByDPR(28),
	bottom: '50%',
	transform: 'translateY(50%)'
}

export class Select extends Component {

	constructor(props) {
		super(props);

	}

	componentDidMount() {
	}

	querySelectedPayPlatform = (value) => {
		let { items } = this.props;
		if (!items) {
			alert("没有获取到select列表");
			return;
		}
		return items.filter((obj) => {
			return obj.value === value
		})
	}


	onChange = (event) => {
		let { onChange } = this.props;
		let obj = this.querySelectedPayPlatform(event.target.value)
		onChange && onChange(obj[0])
	}

	render() {
		let { value, items, onChange, title, errorText, rootStyle, hintText } = this.props;
		return (
			// <div className={css['root']} style={rootStyle}>
			// 	<SelectField
			// 		style={style}
			// 		labelStyle={labelStyle}
			// 		underlineStyle={underlineStyle}
			// 		errorStyle={errorStyle}
			// 		selectedMenuItemStyle={selectedMenuItemStyle}
			// 		value={value}
			// 		onChange={this.onChange}
			// 		errorText={errorText}
			// 		hintStyle={hintStyle}
			// 		hintText={hintText} >
			// 		{
			// 			items && items.map((item) => {
			// 				return (
			// 					<MenuItem key={item.value} value={item.value} primaryText={item.primaryText} />
			// 				)
			// 			})
			// 		}
			// 	</SelectField>
			// 	<span className={css['title']}>{title}</span>
			// </div>
			<div className={css['expectation-select']}>
				<span className={css['expect-title']}>{title}</span>    
				<select 
					onChange={this.onChange}
					value={value || ''}>
					<option disabled value=''>{hintText}</option>
					{
						items && items.map((item, index) => { 
							return <option key={index} value={item.value}>{item.primaryText}</option>
						})
					}
				</select>
				<img src={downIcon} className={css['down-icon']}/>
			</div>
		)
	}
}

Select.propTypes = {
	title: React.PropTypes.string,
	value: React.PropTypes.string,
	hintText: React.PropTypes.string,
	items: React.PropTypes.array,
	rootStyle: React.PropTypes.object,
	errorText: React.PropTypes.string,
	onChange: React.PropTypes.func
}