import React from 'react';

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import moment from 'moment'
import i18n from 'utils/i18n'


const playerCoverStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    fontSize: '15px',
    textAlign: 'center',
    height: '100%',
    paddingTop: '20%',
}
export class Player extends React.Component {

	constructor(props) {
		super(props);
		this.playerSize = this.computePlayerSize()
	}


	computePlayerSize = () => {
		let width = document.documentElement.clientWidth;
		let ratio = 16 / 9;
		let height = width * (1 / ratio);
		return {
			width: width,
			height: height
		}
	}


	setPlayerConfig = (props) => {
		let { pullUrl, cover,isLive, errTip } = props;
		let options = {
			"m3u8": pullUrl,//.replace('.flv', '.m3u8')
			"coverpic": cover,
			"live": !!isLive,
			"width": this.playerSize.width,
			"height": this.playerSize.height,
			"wording": {
				1: errTip,
				2: errTip,
				3: errTip,
				4: errTip,
				5: errTip,
				10: errTip,
				11: errTip,
				12: errTip,
				13: errTip,
				1001: errTip,
				1002: errTip,
				2032: errTip,
				2048: errTip,
			}
		}
		let player = new TcPlayer('id_video_container', options);
	}

	componentWillReceiveProps(newProps) {
		let oldPull = this.props.pullUrl;
		let newPull = newProps.pullUrl;
		if (oldPull !== newPull) {
			let container = document.getElementById("id_video_container");
			container.innerHTML = '';
			this.setPlayerConfig(newProps)
		}
	}


	render() {
		let rootStyle = {
			width: this.playerSize.width,
			height: this.playerSize.height,
		}
		const {state, startTime, pullUrl} = this.props
		return (
			<div style={{position:'relative',zIndex:1400}}>
				<div id="id_video_container" style={rootStyle}></div>
				{state=='NOTSTART'&&<div style={playerCoverStyle}>{i18n[ "live.not.start"]}<br/>{i18n["webcast.start.time"]}{moment(startTime,'X').format('YYYY.MM.DD HH:mm:ss')}</div>}
				{state=='FINISHED'&&<div style={playerCoverStyle}>{i18n["mobile.live.end.key"]}</div>}
				{!pullUrl&&<div style={playerCoverStyle}>{i18n["webcast.error.outservice"]}</div>}
			</div>
		)
	}

}

Player.propTypes = {
	pullUrl: React.PropTypes.string,
	cover: React.PropTypes.string
}