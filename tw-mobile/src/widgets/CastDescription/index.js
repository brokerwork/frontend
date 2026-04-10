import React from 'react';

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { formatDate } from 'utils/formatDate';
import i18n from 'utils/i18n';
import headerImg from 'images/default_header.png'

let rootStyle = {
	padding: `${pxToRem(35)} ${pxToRem(30)}`,
	// borderBottom: '1px solid #EDEDED'
}

let headLineStyle = {
	color: "#3E3E3E",
	fontSize: `${fontSizeByDPR(34)}`,
	marginBottom: pxToRem(25),
	fontWeight: 'bold',
	lineHeight: 1
}

let detailStyle = {
	color: "#939393",
	fontSize: `${fontSizeByDPR(26)}`,
	lineHeight: 1,
	marginBottom: pxToRem(20),
}

let detailValueStyle = {
	color: "#3E3E3E"
}

let descriptionStyle = {
	color: "#939393",
	fontSize: `${fontSizeByDPR(26)}`,
	marginTop: pxToRem(45),
	lineHeight: 1
}
const lecturerStyle = {
	fontSize:'13px',
	color:'#3e3e3e',
	lineHeight:pxToRem(44),
	marginLeft:'5px',
	marginBottom: pxToRem(35),
}
export class CastDescription extends React.Component {

	renderHeadLine = () => {
		let { type, subject, currentVideoName } = this.props;
		if (type === "albumPage") {
			return `${i18n['training.vod.album']}：${subject}`
		}
		if (type === "videoPage") {
			return currentVideoName
		}
		return subject
	}

	renderCastDetail = () => {
		let { type } = this.props;
		if (type === "livePage") {
			return this.renderLiveDetailTemplate()
		}
		if (type === "videoPage") {
			return this.renderVideoDetailTemplate()
		}
		return this.renderAlbumDetailTemplate()
	}

	renderLiveDetailTemplate = () => {
		let { startTime, numberOfPeopleWatching, lecturerName, lecturerAvatar } = this.props;
		// console.log("----renderLiveDetailTemplate time---", startTime);
		return (
			<div>
				<div style={{display:"flex"}}>
					<img src={lecturerAvatar?lecturerAvatar:headerImg} style={{width:pxToRem(44),height:pxToRem(44),borderRadius:pxToRem(22)}}/>
					<div></div>
					<div style={lecturerStyle}>{lecturerName}</div>
				</div>
				<div style={detailStyle}>
					<span>{`${i18n['mobile.widgets.live.time']}：`}&nbsp;</span>
					<span style={detailValueStyle}>{formatDate(startTime)}</span>
				</div>
				<div style={detailStyle}>
					<span>{`${i18n['mobile.widgets.live.look']}：`}&nbsp;</span>
					<span style={detailValueStyle}>{numberOfPeopleWatching}</span>
				</div>
			</div>

		)
	}

	renderVideoDetailTemplate = () => {
		let { subject, numberOfPeopleHaveSeen } = this.props;
		return (
			<div>
				<div style={detailStyle}>
					<span>{i18n['training.live.album']}：&nbsp;</span>
					<span style={detailValueStyle}>{subject}</span>
				</div>
				{/* <div style={detailStyle}>
					<span>{i18n['training.vod.people.seen']}：&nbsp;</span>
					<span style={detailValueStyle}>{`${numberOfPeopleHaveSeen||0}${i18n['training.vod.people.seen.suffix']}`}</span>
				</div> */}
			</div>

		)
	}

	renderAlbumDetailTemplate = () => {
		let { numberOfVideo, numberOfPeopleHaveSeen } = this.props;
		return (
			<div>
				<div style={detailStyle}>
					<span>{`${i18n['mobile.video.key']}：`}&nbsp;</span>
					<span style={detailValueStyle}>{`${numberOfVideo||0}${i18n['mobile.video.a.key']}`}</span>
				</div>
				{/* <div style={detailStyle}> */}
				<div style={{ display: 'none' }}>
					{/*后台暂时还不能返回统计人数，所以这块先隐藏*/}
					<span>{`${i18n['training.vod.people.seen']}：`}&nbsp;</span>
					<span style={detailValueStyle}>{`${numberOfPeopleHaveSeen||0}${i18n['training.vod.people.seen.suffix']}`}</span>
				</div>
			</div>

		)
	}

	render() {
		return (
			<div style={rootStyle} id={this.props.id}>
				<div style={headLineStyle}>{this.renderHeadLine()}</div>
				<div>{this.renderCastDetail()}</div>
				<div style={descriptionStyle}>{this.props.description}</div>
			</div>
		)
	}

}

CastDescription.propTypes = {
	id: React.PropTypes.string,
	type: React.PropTypes.oneOf(["livePage", "videoPage", "albumPage"]),
	subject: React.PropTypes.string,
	description: React.PropTypes.string,
	currentVideoName: React.PropTypes.string,
	numberOfVideo: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	numberOfPeopleHaveSeen: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),	//	看过的人数
	startTime: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	numberOfPeopleWatching: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	])	//	正在观看的人数
}