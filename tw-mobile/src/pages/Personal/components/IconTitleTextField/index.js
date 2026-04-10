import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IconTextField } from '../../../../widgets/IconTextField';

import css from './index.less';
import { pxToRem, fontSizeByDPR } from '../../../../utils/styleUtils.js';

let textStyle = {
	width: "100%",
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	maxHeight: pxToRem(100)
};
let hintStyle = {
	lineHeight: pxToRem(88),
	bottom: "50%",
	transform: "translateY(50%)"
};
let underlineStyle = {
	bottom: 0
};
let underlineFocusStyle = {
	borderColor: "#00A3FE"
};
let underlineDisabledStyle = {
	borderTop: "none",
	borderLeft: "none",
	borderRight: "none",
	borderBottom: "1px solid",
	borderColor: "#ededed"
};
export class IconTitleTextField extends React.Component {
	static defaultProps = {
		title: 'default',
		isconSrc: '',
		type: '',
		value: '',
		disabled: true
	};
	constructor(props) {
		super(props);
	}
	render() {
		let inputStyle = {
			textAlign: 'right',
			color: this.props.value ? "#3e3e3e" : "#939393"
		};
		return (
			<div className={css["formWrapper"]}>
				<IconTextField iconSrc={this.props.iconSrc}
					disabled={this.props.disabled}
					type={"text"}
					value={this.props.value}
					style={textStyle}
					underlineStyle={underlineStyle}
					underlineFocusStyle={underlineFocusStyle}
					hintStyle={hintStyle}
					inputStyle={inputStyle}
					underlineDisabledStyle={underlineDisabledStyle}
				/>
				<span className={css["title"]} style={{fontSize: fontSizeByDPR( 28 ), lineHeight: pxToRem(88), top:0,bottom:0}}>
					{this.props.title}
				</span>
			</div>
		)
	}
}
