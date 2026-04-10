import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import css from './index.less';

let style = {
	width: "100%",
	height: pxToRem(100),
	lineHeight: pxToRem(100),
	top: '3px',
	left: 0,
	position: 'absolute'
}

let menuItemStyle = {
	color: "pink"
}

let labelStyle = {
	paddingLeft: pxToRem(175),
	fontSize: fontSizeByDPR(30),
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

let hiStyle = {
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


	onChange = (evt, key, value) => {
		let { onChange } = this.props;
		let obj = this.querySelectedPayPlatform(value)
		onChange && onChange(obj[0])
	}

	render() {
		let { value, items, onChange, title, errorText, rootStyle, hintText, selectStyle, hintStyle } = this.props;
		let selStyle = selectStyle ? selectStyle : labelStyle
		let hintCss = hintStyle ? hintStyle : hiStyle
		return (
			<div className={css['root']} style={rootStyle}>
				<SelectField
					style={style}
					labelStyle={selStyle}
					underlineStyle={underlineStyle}
					errorStyle={errorStyle}
					selectedMenuItemStyle={selectedMenuItemStyle}
					value={value}
					onChange={this.onChange}
					errorText={errorText}
					hintStyle={hintCss}
					hintText={hintText} >
					{
						items && items.map((item) => {
							return (
								<MenuItem key={item.value} value={item.value} primaryText={item.label} />
							)
						})
					}
				</SelectField>
				<span className={css['title']}>{title}</span>
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