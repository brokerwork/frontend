import React from 'react';
import i18n from 'utils/i18n'

// utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';

let rootStyle = {
	height: pxToRem(228),
	padding: `${pxToRem(45)} ${pxToRem(30)}`,
	backgroundColor: "#fff",
	borderBottom: "1px solid #EDEDED",
	display: "flex"
}

let leftImgStyle = {
	width: pxToRem(247),
	height: pxToRem(138),
	backgroundSize: "100%",
	backgroundRepeat: "no-repeat",
	position: "relative"
}

let minStyle = {
	position: "absolute",
	bottom: pxToRem(10),
	right: pxToRem(10),
	color: "#fff",
	fontSize: fontSizeByDPR(24)
}

let rightInfoStyle = {
	marginLeft: pxToRem(30),
	backgroundColor: "tanpink",
	flex: 1
}

let infoStyle1 = {
	color: "#3E3E3E",
	fontSize: fontSizeByDPR(28),
	fontWeight: "bold",
	marginBottom: pxToRem(30)
}

let infoStyle2 = {
	color: "#939393",
	fontSize: fontSizeByDPR(26),
	marginBottom: pxToRem(10)
}

let numStyle = {
	color: "#00a3fe"
}

export class VideoItem extends React.Component {

	handleTouchTap = () => {
		let onTouchTap = this.props.onTouchTap;
		onTouchTap && onTouchTap()
	}

	renderRight = () => {
		let { size, numberOfPeopleHaveSeen, replayName, subject, modifyTime, cover } = this.props;
		if (this.props.type === 'albumlist') {
			return (
				<div>
					<div style={infoStyle1}>{subject}</div>
					<div style={infoStyle2}>
						{i18n['general.pagination.total']}<span style={numStyle}>{size || 0}</span>{i18n['mobile.video.a.key']}
					</div>
					<div style={infoStyle2}>
						<span>{i18n["training.vod.update"]}：</span>
						<span>{modifyTime}</span>
					</div>
				</div>
			)
		}
		return (
			<div>
				<div style={infoStyle1}>{replayName}</div>
				<div style={infoStyle2}>
					<span>{i18n["training.live.album"]}：</span>
					<span>{subject}</span>
				</div>
				<div style={{ display: 'none' }}>
					{/*后台暂时还不能返回统计人数，所以这块先隐藏*/}
					<div style={infoStyle2}>
						<span>{i18n["training.vod.people.seen"]}</span>
						<span>{numberOfPeopleHaveSeen||0}{i18n["training.vod.people.seen.suffix"]}</span>
					</div>
				</div>
			</div>
		)
	}

	render() {
		let { mins, size, subject, modifyTime, cover } = this.props;
		let leftImgSty = Object.assign({}, leftImgStyle, { "backgroundImage": `url("${cover}")` })
		return (
			<div style={rootStyle}>
				<div style={leftImgSty} onTouchTap={this.handleTouchTap}>
					<span style={minStyle}>{mins}</span>
				</div>
				<div style={rightInfoStyle}>
					{
						this.renderRight()
					}
				</div>
			</div>
		)
	}
}

VideoItem.propTypes = {
	type: React.PropTypes.oneOf(["albumlist", "videoList"]),
	mins: React.PropTypes.oneOfType([ // mins表示时长
		React.PropTypes.string,
		React.PropTypes.number
	]),
	size: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	subject: React.PropTypes.string,
	modifyTime: React.PropTypes.string,
	cover: React.PropTypes.any,
	numberOfPeopleHaveSeen: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),	//	看过的人数
	replayName: React.PropTypes.string,
	onTouchTap: React.PropTypes.func
}