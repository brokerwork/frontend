import * as React from 'react';
import {
	ButtonGroup, Glyphicon, Checkbox,
	MenuItem, Dropdown, Panel, FormGroup, FormControl,
	ControlLabel, Grid, Row, Col, Clearfix, Tabs, Tab,
	TabContainer, TabContent, TabPane
} from 'react-bootstrap';
import { Button, NewSelect } from 'fooui';
import { I18nLoader } from '../../i18n/loader';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P {

}
interface S {
	userPlaceholder: string,
	errorTints: string,
	value: string,
	pwdPlaceholder: string,
	rememberMe: string,
	forgetPwd: string,
	login: string,
	register: string,
	loginChoice: string,
	key: number,
	getCheckCodeholder: string,
	getCheckCode: string,
	agree: string,
	useterms: string,
	hasaccount: string,
	egisterbtn: string,
	emailPlaceholder: string
	registerbtn: string
}

class AppRegister extends React.Component<P, S>{
	constructor(props: P) {
		super(props);
		this.state = {
			hasLogin: false,
			userPlaceholder: I18nLoader.get('login.register.user'),
			pwdPlaceholder: I18nLoader.get('login.register.password'),
			errorTints: I18nLoader.get('login.register.error_message'),
			value: "",
			rememberMe: I18nLoader.get('login.register.remember_me'),
			forgetPwd: I18nLoader.get('login.register.forget_pwd'),
			login: I18nLoader.get('login.register.login'),
			loginChoice: I18nLoader.get('login.register.login_choice'),
			key: 1,
			getCheckCodeholder: I18nLoader.get('login.register.get_check_code'),
			getCheckCode: I18nLoader.get('login.register.get_check_code'),
			agree: I18nLoader.get('login.register.agree'),
			useterms: I18nLoader.get('login.register.use_terms'),
			hasaccount: I18nLoader.get('login.register.has_account'),
			registerbtn: I18nLoader.get('login.register.register'),
			emailPlaceholder: I18nLoader.get('login.register.email')
		}
	}
	componentDidMount() {
		$.ajax({
			// 获取id，challenge，success（是否启用failback）
			url: "http://localhost:8080/pc-geetest/register?t=" + (new Date()).getTime(), // 加随机数防止缓存
			type: "get",
			dataType: "json",
			success: function (data) {
				// 使用initGeetest接口
				// 参数1：配置参数
				// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
				initGeetest({
					gt: data.gt,
					challenge: data.challenge,
					width: "314px",
					product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
					offline: !data.success// 表示用户后台检测极验服务器是否宕机，一般不需要关注
					// 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config    
				}, handlerPopup);
			}
		});

		function handlerPopup(captchaObj) {
			$("#popup-submit").click(function () {
				var validate = captchaObj.getValidate();
				if (validate) {



				}
				if (!validate) {
					alert(I18nLoader.get('login.validate_error'));
					return;
				}
				$.ajax({
					url: "/geetest/validate", // 进行二次验证
					type: "post",
					dataType: "json",
					data: {
						// 二次验证所需的三个值
						geetest_challenge: validate.geetest_challenge,
						geetest_validate: validate.geetest_validate,
						geetest_seccode: validate.geetest_seccode
					},
					success: function (data) {
						if (data && (data.status === "success")) {
							$(document.body).html(`<h1>${I18nLoader.get('login.register.login_success')}</h1>`);
						} else {
							$(document.body).html(`<h1>${I18nLoader.get('login.register.login_fail')}</h1>`);
						}
					}
				});
			});
			// 弹出式需要绑定触发验证码弹出按钮
			captchaObj.bindOn("#popup-submit");
			// 将验证码加到id为captcha的元素里
			captchaObj.appendTo("#popup-captcha");
			// 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
		}
	}
	getValidationState() {
		const length = this.state.value.length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
	}

	handleChange = (e) => {
		let dataValue = e.target.getAttribute('data-value');
		this.setState({ value: dataValue });
	}
	resetPwd = () => {

	}
	handleSelect = (key) => {

		this.setState({ key });
	}
	changeLanguage = () => {
		var currentLanguage = this.refs.language.getCurrentItemValue();
		I18nLoader.setLang(currentLanguage);
	}
	render() {
		const languages = [
			{ label: I18nLoader.get('language.chinese.simplified'), value: 'zh-CN', icon: '86.png' },
			{ label: I18nLoader.get('language.english'), value: 'en-US', icon: '44.png' },
			{ label: I18nLoader.get('language.chinese.traditional.tw'), value: 'zh-TW', icon: '886.png' }
		];
		const lang = I18nLoader.getLang();
		const currentLanguage = languages.find(item => item.value === lang);

		return (
			<div className="wholePage">
				<div className="loginPanelMark">
					<form className="loginPanel">
						<div className="loginHeader">
							<img src="../images/logo.png" className="loginLogo" />
							<div className="languange-choice">
								<NewSelect 
									ref="language"
									options={languages}
									btnText={currentLanguage.label} 
									className="header-lang header-menu"
									imgSrc={`http://broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country/${currentLanguage.icon}`}
									iconRight="fa fa-angle-down"
									isChangeText={true}
									alignment="alignRight"
									onChange={this.changeLanguage}
								/>
							</div>
						</div>
						<div className="registerContent">
							<Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
								<Tab eventKey={1} className="aa" title={I18nLoader.get('login.register.phone_register')}>
									<FormGroup controlId="userName" validationState={this.getValidationState()}>
										<FormControl id="userName" type="text" data-value={this.state.value} placeholder={this.state.userPlaceholder} onChange={this.handleChange} />
										<FormControl.Feedback />
									</FormGroup>
									<FormGroup validationState={this.getValidationState()}>
										<FormControl id="passWord" type="text" data-value={this.state.value} placeholder={this.state.pwdPlaceholder} onChange={this.handleChange} />
										<FormControl.Feedback />
									</FormGroup>
									<FormGroup className="checkCode" validationState={this.getValidationState()}>
										<FormControl id="checkCode" type="text" data-value={this.state.value} placeholder={this.state.getCheckCodeholder} onChange={this.handleChange} />
										<FormControl.Feedback />
									</FormGroup>
									<Button className="checkCodeBtn" style={{ width: "99%" }} bsSize="large" block>{this.state.getCheckCode}</Button>
									<Checkbox checked>
										{this.state.agree}<a href="#">{this.state.useterms}</a>
									</Checkbox>
									<Button bsStyle="primary" className="registerbtn" style={{ width: "99%" }} bsSize="large" block>{this.state.registerbtn}</Button>
									<Button className="hasaccountbtn ghost-btn" style={{ width: "99%" }} bsSize="large" block><Link to={'entrance'}>{this.state.hasaccount}</Link></Button>
									<div className="thirdPartyLogin">
										<div className="introTitle">
											<hr />
											<div className="loginChoice">{this.state.loginChoice}</div>
											<hr />
										</div>
										<ul className="choseWay">
											<li className="wall">
												<div className="imgMark">
													<div className="wallimg"></div>
												</div>
											</li>
											<li className="QQ">
												<div className="imgMark">
													<div className="QQimg"></div>
												</div>
											</li>
											<li className="WX">
												<div className="imgMark">
													<div className="WXimg"></div>
												</div>
											</li>
											<li className="FB">
												<div className="imgMark">
													<div className="FBimg"></div>
												</div>
											</li>
										</ul>
									</div>
								</Tab>
								<Tab eventKey={2} title={I18nLoader.get('login.register.email_register')}>
									<FormGroup controlId="email" validationState={this.getValidationState()}>
										<FormControl id="email" type="text" data-value={this.state.value} placeholder={this.state.emailPlaceholder} onChange={this.handleChange} />
										<FormControl.Feedback />
									</FormGroup>
									<FormGroup validationState={this.getValidationState()}>
										<FormControl id="passWord" type="text" data-value={this.state.value} placeholder={this.state.pwdPlaceholder} onChange={this.handleChange} />
										<FormControl.Feedback />
									</FormGroup>
									<div id="popup-captcha"></div>
									<Checkbox checked>
										{this.state.agree}<a href="#">{this.state.useterms}</a>
									</Checkbox>
									<Button bsStyle="primary" style={{ width: "99%" }} bsSize="large" block id="popup-submit">{this.state.registerbtn}</Button>
									<Button className="hasaccountbtn ghost-btn" style={{ width: "99%" }} bsSize="large" block><Link to={'entrance'}>{this.state.hasaccount}</Link></Button>
									<div className="thirdPartyLogin">
										<div className="introTitle">
											<hr />
											<div className="loginChoice">{this.state.loginChoice}</div>
											<hr />
										</div>
										<ul className="choseWay">
											<li className="wall">
												<div className="imgMark">
													<div className="wallimg"></div>
												</div>
											</li>
											<li className="QQ">
												<div className="imgMark">
													<div className="QQimg"></div>
												</div>
											</li>
											<li className="WX">
												<div className="imgMark">
													<div className="WXimg"></div>
												</div>
											</li>
											<li className="FB">
												<div className="imgMark">
													<div className="FBimg"></div>
												</div>
											</li>
										</ul>
									</div>

								</Tab>
							</Tabs>
						</div>

						<div className="beautifulBlank"></div>
					</form>
				</div>
			</div>
		);
	}
}

export { AppRegister };