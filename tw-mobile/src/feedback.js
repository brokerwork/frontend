/**
 * 第三方授权通过的feedback页面
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { parseUrlParams } from './utils/urlUtils';
import { Page, PageContent } from 'widgets/PageWrapper';
import css from './pages/Entrance/components/index.less';
import FlatButton from 'material-ui/FlatButton';;
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

function computePlaceholderHeight() {
	let iScroller = document.getElementById("scroller");
	let wrapper = iScroller.parentNode;
	let placeholder = document.getElementsByClassName("entrance-placeholder")[0];
	let wh = wrapper.offsetHeight;
	let sh = iScroller.offsetHeight;
	placeholder.style.height = wh - sh + "px";
}

let style = {
	fontSize: fontSizeByDPR(20),
	boxShadow: 'none'
}
let overlayStyle = {
	lineHeight: pxToRem(88),
	height: pxToRem(88)
}
let buttonStyle = {
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}
export class ThirdPartyFeedback extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		computePlaceholderHeight();
	}

	render() {
		return (
			<MuiThemeProvider>
				<Page>
					<PageContent>
						<div className={css['gradient-bg']}>
							<div className={`${css['sector']} ${css['h250']}`}>
								<div className={css['logo']}></div>
							</div>
							<div className={`${css['sector']} ${css['h255']}`}>
								<div className={css['computer']}></div>
							</div>
							<div className={`${css['sector']} ${css['h172']}`}>
								<div className={css['text']}>
									<p>授权成功，感谢您选择 Trader Work</p>
								</div>
							</div>
							<div className="entrance-placeholder"></div>
						</div>
					</PageContent>
				</Page>
			</MuiThemeProvider>
		)
	}
}

ReactDOM.render(<ThirdPartyFeedback />, document.getElementById('app'));