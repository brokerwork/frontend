import React from 'react';

// components
import { CastItemCover } from './CastItemCover';
import { CastItemText } from './CastItemText';

// utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';


let rootStyle = {
	backgroundColor: "white",
	marginBottom: pxToRem(20),
	boxShadow: '0 0 0.05rem rgba(0,0,0,0.2)'
}


export class CastItem extends React.Component {

	render() {
		let { pullUrl, cover, subject, lecturerName, state, startTime, id, description, onTouchTap } = this.props;
		return (
			<div style={rootStyle}>
				<CastItemCover
					cover={cover}
					state={state}
					startTime={startTime}
					onTouchTap={onTouchTap}
					id={id}
					subject={subject}
					description={description}
					pullUrl={pullUrl}
				/>
				<CastItemText
					subject={subject}
					lecturerName={lecturerName}
				/>
			</div>
		)
	}
}

CastItem.propTypes = {
	cover: React.PropTypes.any,
	subject: React.PropTypes.string,
	lecturerName: React.PropTypes.string,
	state: React.PropTypes.string,
	startTime: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	id: React.PropTypes.string,
	pullUrl: React.PropTypes.string,
	onTouchTap: React.PropTypes.func
}