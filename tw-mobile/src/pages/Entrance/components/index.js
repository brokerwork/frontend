import React from 'react';
import { Page, PageContent } from 'widgets/PageWrapper';
import { Header } from 'widgets/Header';
import css from './index.less';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { get } from 'utils/api';
import wxUtils from 'utils/wxUtils';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { IScrollView } from 'widgets/IScrollView';
import { getCachedToken } from 'utils/userinfo.js'
import LanguageSelector from 'widgets/LanguageSelector'

import i18n from 'utils/i18n'
import language from 'utils/language';

let style = {
	fontSize: fontSizeByDPR(20),
	boxShadow: 'none',
	marginBottom: pxToRem(40),
	marginLeft: pxToRem(30),
	marginRight: pxToRem(30),
	backgroundColor: 'transparent',
	display: "block"
}
let overlayStyle = {
	lineHeight: pxToRem(88),
	height: pxToRem(88),
	borderRadius: pxToRem(5),
	border: '1px solid white'
}
let buttonStyle = {
	height: pxToRem(88),
	lineHeight: pxToRem(88),
	backgroundColor: 'transparent'
}

export class Entrance extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dialogOpen: true
		}
	}

	componentWillMount() { 
		let token = getCachedToken()
		let href = window.location.href
		//	不在微信 跳回PC端登录页
		if (!wxUtils.isWechat() && window.location.href.indexOf('localhost') === -1) { 
			if (!token || token === 'unkown') { 
				window.location.href = '/login'
			}
		}
		//	PC域名(PC过来域名含mobile)跳转过来,判断登录
		if (href.indexOf('mobile') !== -1 && token && token !== 'unkown' && token !== 'null' && token !== 'undefined') {
			this.props.router.replace('/accounts')
		}
	}

	openWeixinRegisterURL = () => {
		var oauth_url = wxUtils.getPreSignupURL();
		window.location.href = oauth_url;
	}
	openLoginURL = () => {
		this.props.router.push('/login');
	}

	//	切换语言
	turnLanguage = (val) => { 
		const { changeLanguage } = this.props
		changeLanguage(val)
	}

	render() {
		let {productLogo} = this.props.brand;
		return (
			<IScrollView>
				<div className={css['gradient-bg']}>
					{/* 语言选择 */}
					<div className={css['selector']}>
						<LanguageSelector
							defaultLanguage={language.getType()}
							turnLanguage={this.turnLanguage} />
					</div>
					<div className={`${css['sector']} ${css['h250']}`}>
						<div className={css['logo']}>
							<img src={productLogo}/>
						</div>
					</div>
					<div className={`${css['sector']} ${css['h255']}`}>
						<div className={css['computer']}></div>
					</div>
					<div className={`${css['sector']} ${css['h172']}`}>
						<div className={css['text']}>
							<p>{i18n['mobile.one.business.hall.key']},</p>
							<p>{i18n['mobile.customer.service.key']}。</p>
						</div>
					</div>
					<div className={css['buttons']}>
						<RaisedButton
							style={style}
							buttonStyle={buttonStyle}
							overlayStyle={overlayStyle}
							label={i18n['mobile.wechat.regisiter.key']}
							className={css['entrance-button']}
							primary={true}
							onTouchTap={this.openWeixinRegisterURL} />
						<RaisedButton
							style={style}
							buttonStyle={buttonStyle}
							overlayStyle={overlayStyle}
							label={i18n['mobile.entrance.login.key']}
							className={css['entrance-button']}
							primary={true}
							onTouchTap={this.openLoginURL} />
					</div>
					<div className={css["palceholder"]}>
					</div>
				</div>
			</IScrollView>
		)
	}
}