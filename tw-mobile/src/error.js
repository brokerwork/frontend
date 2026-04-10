import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { FullPagePaper } from 'widgets/FullPagePaper';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {parseUrlParams} from './utils/urlUtils';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const bgImg = require('images/404.png');
const opStyle = {
	textAlign: 'center',
	marginTop: pxToRem(30),
	marginBottom: pxToRem(30),
	fontSize: fontSizeByDPR(28)
}
const responsiveBgStyle = {
	width: pxToRem(390),
	height: pxToRem(287),
	paddingTop: pxToRem(238),
	margin: '0 auto'
}
const buttonStyle = {
	width: pxToRem(234),
	borderRadius: '8px',
	backgroundColor: 'white'
}
class ErrorPage extends Component {

	render() {
		let globalVar = window.GlobalVar || {};
		let errorCode = globalVar.code || parseUrlParams().code || '页面找不到了';
		return (
			<MuiThemeProvider>
				<FullPagePaper style={{ padding: 0 }} paperStyle={{ backgroundColor: '#fafafa' }}>
					<div style={responsiveBgStyle}>
						<img src={bgImg} style={{ width: '100%', height: 'auto' }} />
					</div>
					<p style={opStyle}>
						Oops! <span style={{color:'red'}}>{errorCode}</span>
				</p>
					<div style={{ textAlign: 'center' }}>
						<RaisedButton
							primary
							label="点击刷新"
							style={buttonStyle}
							onTouchTap={() => { }}
						/>
					</div>
				</FullPagePaper>
			</MuiThemeProvider>
		)
	}
}

ReactDOM.render(<ErrorPage />, document.getElementById('app'));