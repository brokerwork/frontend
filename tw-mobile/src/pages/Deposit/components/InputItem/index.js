import React from 'react';
import TextField from 'material-ui/TextField';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import css from "./index.less";

let style = {
	width: "100%",
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	maxHeight: pxToRem(100)
}

let inputStyle = {
	paddingRight: pxToRem(30),
	paddingLeft: pxToRem(175),
	fontSize: fontSizeByDPR(30),
	color: '#000',
}

let underlineStyle = {
	bottom: 0
}

let hintStyle = {
	left: pxToRem(175),
	fontSize: fontSizeByDPR(28),
	bottom: '50%',
	transform: 'translateY(50%)'
}

let errorStyle = {
	position: 'absolute',
	bottom: '-14px',
	left: pxToRem(30)
}

export class InputItem extends React.Component {

	onChange = (evt, value) => {
		let { onChange } = this.props;
		onChange && onChange(value);
	}

	render() {
		let {
			errorText,
			hintText,
			title,
			value,
			disabled,
			defaultValue,
			onChange,
			onBlur,
			titleStyle,
			itemStyle,
			underlineDisabledStyle
    } = this.props;
		return (
			<div>
				<div className={css["item"]} style={itemStyle}>
					<span className={css["title"]} style={titleStyle}>{title}</span>
					<TextField
						style={style}
						inputStyle={inputStyle}
						hintStyle={hintStyle}
						underlineStyle={underlineStyle}
						underlineDisabledStyle={underlineDisabledStyle}
						errorStyle={errorStyle}
						hintText={hintText}
						errorText={errorText}
						value={value}
						defaultValue={defaultValue}
						disabled={disabled}
						onChange={this.onChange}
						onBlur={onBlur}
						id={`tf${new Date().getTime()}`}
					/>
				</div>
			</div>
		)
	}
}

InputItem.propTypes = {
	title: React.PropTypes.string,
	hintText: React.PropTypes.string,
	errorText: React.PropTypes.string,
	value: React.PropTypes.string,
	defaultValue: React.PropTypes.string,
	disabled: React.PropTypes.bool,
	onChange: React.PropTypes.func,
	onBlur: React.PropTypes.func,
	underlineDisabledStyle: React.PropTypes.object,
	titleStyle: React.PropTypes.object,
	itemStyle: React.PropTypes.object
}