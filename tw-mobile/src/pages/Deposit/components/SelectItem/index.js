import React from 'react';
import TextField from 'material-ui/TextField';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import css from "./index.less";

let style = {
	width: "100%",
	height: pxToRem(100)
	// borderTop: "1px solid #E1E1E1"
}

let inputStyle = {
	paddingRight: pxToRem(120),
	paddingLeft: pxToRem(175),  //  175 = 30(右间距) + 30 * 4(4个文字) + 25(左间距)
	fontSize: fontSizeByDPR(30),
	lineHeight: pxToRem(100)
}

let underlineStyle = {
	bottom: 0,
	borderBottomStyle: "solid",
	borderBottomWidth: "1px",
	borderBottomColor: "#E1E1E1"
}

let hintStyle = {
	left: pxToRem(175),
	fontSize: fontSizeByDPR(28),
	bottom: '50%',
	transform: 'translateY(50%)',
	color: "#00A3FE",
	fontWeight: "bold"
}

export class SelectItem extends React.Component {

	render() {
		let { defaultValue, hintText, errorText, onTouchTap, title, value } = this.props;
		return (
			<div className={css["Root"]}>
				<span className={css["title"]}>{title}</span>
				<TextField
					style={style}
					disabled={true}
					inputStyle={inputStyle}
					underlineStyle={underlineStyle}
					hintStyle={hintStyle}
					defaultValue={defaultValue}
					hintText={hintText}
					errorText={errorText}
					value={value}
				/>
				<a className={css["arrow"]} onTouchTap={onTouchTap}></a>
			</div>
		)
	}
}

SelectItem.propTypes = {
	title: React.PropTypes.string,
	onTouchTap: React.PropTypes.func,
	defaultValue: React.PropTypes.string,
	errorText: React.PropTypes.string,
	hintText: React.PropTypes.string,
	value: React.PropTypes.string
}