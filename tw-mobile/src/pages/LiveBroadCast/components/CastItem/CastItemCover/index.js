import React from 'react';

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import i18n from 'utils/i18n'

let playSrc = require("images/play.png");

let rootStyle = {
	height: pxToRem(417),
	backgroundColor: 'red',
	position: "relative"
}

let imgStyle = {
	height: pxToRem(417),
	width: "100%"
}

let maskStyle = {
	height: pxToRem(417),
	width: "100%",
	backgroundColor: 'rgba(0,0,0,.7)',
	position: "absolute",
	top: 0,
	left: 0
}

let playStyle = {
	width: pxToRem(110),
	height: pxToRem(110),
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translateY(-50%) translateX(-50%)",
	background: `url(${playSrc}) no-repeat`,
	backgroundSize: "100%"
}

let castStatusStyle = {
	padding: `0 ${pxToRem(15)}`,
	height: pxToRem(44),
	lineHeight: pxToRem(44),
	position: "absolute",
	top: pxToRem(30),
	right: pxToRem(30),
	border: "1px solid #3DBDBB",
	borderRadius: "50px",
	color: "#3DBDBB",
	textAlign: "center"
}

let stateTable = {
	notstart: i18n['mobile.not.live.key'],
	started: i18n['mobile.living.key'],
	finished: i18n['mobile.live.end.key'],
	all: i18n['datepicker.range.all']
}


export class CastItemCover extends React.Component {


	convertMins = (mins) => {
		console.log("间隔的分钟是------", mins);
		let result;
		let day = parseInt(mins / (24 * 60));
		let hour = parseInt((mins - day * 24 * 60) / 60);
		let minute = mins - day * 24 * 60 - hour * 60;
		if (day <= 0) {
			if (hour <= 0) {
				result = `${minute}${i18n['mobile.minute.key']}后`;
			} else {
				result = `${hour}${i18n['mobile.hour.key']}${minute}${i18n['mobile.minute.key']}后`
			}
		} else {
			result = `${day}${i18n['mobile.day.key']}${hour}${i18n['mobile.hour.key']}${minute}${i18n['mobile.minute.key']}后`
		}
		return result
	}

	parseStateText = (state) => {
		let result;
		if (state === 'notstart') {
			let startTime = this.props.startTime;	//	秒级时间戳
			let currentTime = parseInt((new Date().getTime()) / 1000);
			let intervalTime = startTime - currentTime;
			let mins = parseInt(intervalTime / 60);
			result = this.convertMins(mins)
		} else {
			result = stateTable[state]
		}
		return result;
	}

	handleTouchTap = () => {
		let { onTouchTap } = this.props;
		onTouchTap && onTouchTap();
	}

	renderMask = () => {
		let state = this.props.state && this.props.state.toLowerCase();
		let playStyleCopy = Object.assign({}, playStyle);
		let castStatusStyleCopy = Object.assign({}, castStatusStyle);
		if (state !== 'started') {
			playStyleCopy = Object.assign({}, playStyleCopy, { "display": "none" });
			castStatusStyleCopy = Object.assign({}, castStatusStyleCopy, { "color": "#fff", "borderColor": "#fff" })
		}
		return (
			<div style={maskStyle}>
				<span style={playStyleCopy}></span>
				<span style={castStatusStyleCopy}>{this.parseStateText(state)}</span>
			</div>
		)
	}

	render() {
		return (
			<div style={rootStyle} onTouchTap={this.handleTouchTap}>
				<img src={this.props.cover} style={imgStyle} />
				{
					this.renderMask()
				}
			</div>
		)
	}
}

CastItemCover.propTypes = {
	cover: React.PropTypes.any,
	state: React.PropTypes.string,
	startTime: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	id: React.PropTypes.string,
	pullUrl: React.PropTypes.string,
	subject: React.PropTypes.string,
	description: React.PropTypes.string,
	onTouchTap: React.PropTypes.func
}