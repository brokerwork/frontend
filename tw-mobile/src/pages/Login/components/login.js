import React from 'react';
import { connect } from 'react-redux';
import { Page, PageContent, PageFooter } from '../../../widgets/PageWrapper';
import { Header } from "../../../widgets/Header";
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import { post } from '../../../utils/api';
import wxUtils from 'utils/wxUtils';
import { pxToRem, fontSizeByDPR } from '../../../utils/styleUtils';
import { IconTextField } from "../../../widgets/IconTextField";
import { UserInfo } from 'utils/userinfo';
import { Validator } from 'utils/validator';
import css from "./login.less";
import { doLogin } from '../actions';
import i18n from 'utils/i18n';

import { ConfirmDialog } from "./confirmDialog"

let emailSrc = require("images/icon_email@3x.png");
let pwdSrc = require("images/icon_password@3x.png");
let phoneSrc = require("images/icon_phone_number@3x.png");
import phoneDownSrc from 'images/icon_phoneDown.png'

let contentContainerStyle = {
	marginTop: "0.26666666666666666rem",
	borderTop: "1px solid #e0e0e0"
}

let textStyle = {
	width: "calc( 100% - 0.4rem - 0.4rem )", // 因为左右margin是30px
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	marginLeft: pxToRem(30),
	marginRight: pxToRem(30),
	maxHeight: pxToRem(100)

}

let hintStyle = {
	
}

let hintStylePhone = {
	paddingLeft: pxToRem(150)
}

let inputStylePhone = {
	paddingLeft: pxToRem(150)
}

let underlineStyle = {
	bottom: 0
}

let buttonRootStyle = {
	width: "92%",  //  （ 750 - 60 ）/ 750 = 0.92
	marginLeft: "4%",
	marginTop: pxToRem(50),
	boxShadow: "#C1DDFB 0px 1px 6px, #C1DDFB 0px 1px 4px",
	borderRadius: pxToRem(8)
}

let buttonStyle = {
	backgroundColor: "#00a3fe",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}

let overlayStyle = {
	height: pxToRem(88)
}

let inkBarStyle = {
	height: pxToRem(7),
	marginTop: pxToRem(-7),
	backgroundColor: "#fff",
	boxShadow: "0 0 0.05rem rgba(0,0,0,0.2)"
}

let bodyStyle = {
	padding: `${pxToRem(35)} ${pxToRem(30)}`
}

let actionsContainerStyle = {
	borderTop: "1px solid black"
}

export class Login extends React.Component {
	constructor() {
		super();
		this.wxDirectLoginUrl = wxUtils.getPreSignupURL()
		this.state = {
			open: false,
			tabValue: "email",
			countryCode: '86',
		}
	}

	componentDidMount() { 
		//	不在微信 跳回PC端登录页
		if (!wxUtils.isWechat() && window.location.href.indexOf('localhost') === -1 ) { 
			window.location.href = '/login'
		}
		let em = window.localStorage.getItem('em')
		let empwd = window.localStorage.getItem('empwd')
		let ph = window.localStorage.getItem('ph')
		let phpwd = window.localStorage.getItem('phpwd')
		if (em && empwd) { 
			this.props.updateEmail(em)
			this.props.updateEmailPwd(empwd)
		}
		if (ph && phpwd) { 
			this.props.updatePhone(ph)
			this.props.updatePhonePwd(phpwd)
		}
	}

	_loginByMail = () => {
		let { email, emailPwd } = this.props;
		let regPwd = /\S+/;
		if (!Validator.isEmail(email)) {
			this.props.updateEmailErrorText(i18n['mockaccount.email.tip']);
			return
		}
		this.props.updateEmailErrorText(null)
		if (!regPwd.test(emailPwd)) {
			this.props.updateEmailPwdErrorText(i18n['overview.account.active.confirm.password.required']);
			return
		}
		this.props.updateEmailPwdErrorText(null)
		this.setState({
			open: true
		})
	}

	_loginByPhone = () => {
		let { phone, phonePwd } = this.props;
		let regPhone = /^\d{5,11}$/g;
		let regPwd = /\S+/;
		if (!regPhone.test(phone)) {
			this.props.updatePhoneErrorText(i18n['mockaccount.phone.tip'])
			return
		}
		this.props.updatePhoneErrorText(null)
		if (!regPwd.test(phonePwd)) {
			this.props.updatePhonePwdErrorText(i18n['overview.account.active.confirm.password.required']);
			return
		}
		this.props.updatePhonePwdErrorText(null);
		this.setState({
			open: true
		})
	}

	_onLoginBtnClick = () => {
		let { updateUserInfo, msgDialog } = this.props;
		let currentTab = this.state.tabValue;
		if (currentTab === "email") {
			let { email, emailPwd } = this.props;
			doLogin('', email, emailPwd).then(res => {
				updateUserInfo(res.data)
				window.localStorage.setItem('em', email)
				window.localStorage.setItem('empwd', emailPwd)
				this.props.router.push('/accounts')
			}).catch((err) => { 
				msgDialog(err)
			})
			this.setState({
				open: false
			})
		} else {
			let { phone, phonePwd } = this.props;
			let { countryCode } = this.state
			doLogin(countryCode, phone, phonePwd).then(res => {
				updateUserInfo(res.data)
				window.localStorage.setItem('ph', phone)
				window.localStorage.setItem('phpwd', phonePwd)
				this.props.router.push('/accounts')
			}).catch((err) => { 
				msgDialog(err)
			})
			this.setState({
				open: false
			})
		}
	}

	_onEmailChange = (event, newValue) => {
		this.props.updateEmailErrorText("");
		this.props.updateEmail(newValue)
	}
	_onEmailPwdChange = (event, newValue) => {
		this.props.updatePhonePwdErrorText("");
		this.props.updateEmailPwd(newValue)
	}
	_onPhoneChange = (event, newValue) => {
		this.props.updatePhoneErrorText("")
		this.props.updatePhone(newValue)
	}

	_onPhonePwdChange = (event, newValue) => {
		this.props.updatePhonePwdErrorText("");
		this.props.updatePhonePwd(newValue)
	}

	_handleChangeTabs = (val) => {
		this.setState({
			tabValue: val
		})
	}
	_loginAndBindWeixin = () => {
		let { getBindWeixinTmpKey, msgDialog } = this.props;
		let formData = this.getFormData();
		let username = formData.username;
		let password = formData.password;
		getBindWeixinTmpKey(username, password).then(res => {
			if (!res.result) {
				msgDialog(res.mcode)
				return;
			}
			let key = res.data;
			window.location.href = wxUtils.getBindWeixinURL(key);
		}, (error) => {
			msgDialog(error)
		})
	}
	getFormData = () => {
		let currentTab = this.state.tabValue;
		let username = '';
		let password = '';
		if (currentTab === "email") {
			username = this.props.email;
			password = this.props.emailPwd;
		} else {
			let { loginByMail, loginByPhone } = this.props;
			username = this.props.phone;
			password = this.props.phonePwd;
		}
		return { username, password }
	}
	_wxLogin = (e) => {
		window.location.href = this.wxDirectLoginUrl;
	}
	changeCountryCode = (e) => { 
		this.setState({
			countryCode: e.target.value
		})
	}
	render() {
		let myAccountIcon = <FontIcon className={`iconfont icon-yonghu ${css["account-icon"]}`}></FontIcon>;
		let size = fontSizeByDPR(24);
		let doubleSize = parseInt(size) * 2 + "px";
		let {
			email,
			emailPwd,
			emailErrorText,
			emailPwdErrorText,
			phone,
			phonePwd,
			phoneErrorText,
			phonePwdErrorText
		} = this.props
		let { productLogo } = this.props.brand;
		const { countryPhone } = this.props
		return (
			<Page fullPage>
				<PageContent>
					<div className={css["login"]}>
						<Header>
							<div className={css["logo"]}>
								<img src={productLogo} />
							</div>
						</Header>
						<Tabs
							className={css["tabs"]}
							contentContainerStyle={contentContainerStyle}
							inkBarStyle={inkBarStyle}
							value={this.state.tabValue}
							onChange={this._handleChangeTabs}
						>
							<Tab
								label={i18n['mobile.email.login.key']}
								className={css["tab"]}
								style={{float:"left"}}
								value="email" >
								<div className={css["e-area"]}>
									<div className={css["item"]}>
										<IconTextField
											iconSrc={emailSrc}
											hintText={i18n['menu.email']}
											value={email}
											onChange={this._onEmailChange}
											style={textStyle}
											underlineStyle={underlineStyle}
											hintStyle={hintStyle}
											errorText={emailErrorText} />
									</div>
									<div className={css["item"]}>
										<IconTextField
											iconSrc={pwdSrc}
											value={emailPwd}
											hintText={i18n['login.password.tw']}
											onChange={this._onEmailPwdChange}
											style={textStyle}
											underlineStyle={underlineStyle}
											hintStyle={hintStyle}
											type="password"
											className={css["specialLine"]}
											errorText={emailPwdErrorText} />
									</div>

								</div>
								<RaisedButton
									label={i18n['general.gotologin']}
									primary={true}
									className={css["login-btn"]}
									style={buttonRootStyle}
									buttonStyle={buttonStyle}
									onTouchTap={this._loginByMail}
									overlayStyle={overlayStyle} />
							</Tab>
							<Tab label={i18n['mobile.mobile.login.key']} className={css["tab"]} value="phone" style={{float:"right"}}>
								<div className={css["e-area"]}>
									<div className={css["item"]}>
										<div className={css['item-select']}>
											<select
												value={this.state.countryCode}	
												onChange={this.changeCountryCode}>
												{
													countryPhone && countryPhone.length ? countryPhone.map((item, index) => {
														return <option key={index} value={item.value} >+{item.value}</option>	
													}) : <option value="86">+86</option>
												}	
												
											</select>	
											<img src={phoneDownSrc} />
										</div>
										<IconTextField
											iconSrc={phoneSrc}
											value={phone}
											hintText={i18n['tausermgmt.phone']}
											onChange={this._onPhoneChange}
											style={textStyle}
											inputStyle={inputStylePhone}
											underlineStyle={underlineStyle}
											hintStyle={hintStylePhone}
											errorText={phoneErrorText}
										/>
									</div>
									<div className={css["item"]}>
										<IconTextField
											iconSrc={pwdSrc}
											value={phonePwd}
											hintText={i18n['login.password.tw']}
											onChange={this._onPhonePwdChange}
											style={textStyle}
											underlineStyle={underlineStyle}
											hintStyle={hintStyle}
											type="password"
											className={css["specialLine"]}
											errorText={phonePwdErrorText}
										/>
									</div>

								</div>
								<RaisedButton
									label={i18n['mobile.mobile.login.key']}
									primary={true}
									className={css["login-btn"]}
									style={buttonRootStyle}
									buttonStyle={buttonStyle}
									onTouchTap={this._loginByPhone}
									overlayStyle={overlayStyle}
								/>
							</Tab>
						</Tabs>
						<div className={css["footer"]}>
							<div className={css["weixin-login"]}>
								<p>
									<span
										className={css["link"]}
										onTouchTap={this._wxLogin}>
										{i18n['mobile.no.account.key']}？{i18n['mobile.direct.wechat.key']}
                 	</span>
								</p>
							</div>
						</div>
						<ConfirmDialog
							title={i18n['mobile.bind.login.key']}
							open={this.state.open}
							handleCancel={this._onLoginBtnClick}
							handleConfirm={this._loginAndBindWeixin}
							cancelText={i18n['mobile.direct.login.key']}
							confirmText={i18n['mobile.login.bind.key']}
							onRequestClose={() => { this.setState({ open: false }) }} >
							{i18n['mobile.bind.wechat.key']}
						</ConfirmDialog>
					</div>
				</PageContent>
			</Page>
		)
	}
}