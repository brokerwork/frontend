import React from 'react';

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import i18n from 'utils/i18n'

let rootStyle = {
	paddingLeft: pxToRem(30),
	paddingTop: pxToRem(20)
}

let subjectStyle = {
	fontSize: fontSizeByDPR(34),
	fontWeight: "bold",
	color: "#3E3E3E",
	paddingBottom: pxToRem(20)
}

let lecturerStyle = {
	fontSize: fontSizeByDPR(28),
	color: "#939393",
	paddingBottom: pxToRem(20)
}

export class CastItemText extends React.Component {
	render() {
		return (
			<div style={rootStyle}>
				<div style={subjectStyle}>{this.props.subject}</div>
				<div style={lecturerStyle}>
					<span>{i18n['training.live.lecture']}：</span>
					<span>{this.props.lecturerName}</span>
				</div>
			</div>
		)
	}
}

CastItemText.propTypes = {
	subject: React.PropTypes.string,
	lecturerName: React.PropTypes.string
}