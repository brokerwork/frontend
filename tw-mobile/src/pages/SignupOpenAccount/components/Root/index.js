import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { Page, PageContent } from '../../../../widgets/PageWrapper/index';
import { IconTextField } from '../../../../widgets/IconTextField/index';
import { FormConfirmation } from '../../../../widgets/FormConfirmation/index';
import { IconSelectField } from '../../../../widgets/IconSelectField/index';
import { Agreements } from '../../../../widgets/Agreements/index';
import { pxToRem, fontSizeByDPR } from '../../../../utils/styleUtils';
import css from './index.less';
import { DisclaimerCard } from 'pages/Accounts/components/DisclaimerCard';
import i18n from 'utils/i18n';
import {get} from 'utils/api';

// images
let serverIcon = require('images/icon_server@3x.png');
let accountTypeIcon = require('images/icon_type@3x.png');
let accountNameIcon = require('images/icon_name@3x.png');
let emailIcon = require('images/icon_email@3x.png');
let areaCodeIcon = require('images/icon_area_code@3x.png');
let phoneIcon = require('images/icon_phone_number@3x.png');
let verificationIcon = require('images/icon_verification_code@3x.png');
let pwdIcon = require('images/icon_password@3x.png');
let pwd2Icon = require('images/icon_confirm_password@3x.png');

let textStyle = {
	width: "100%",
	height: pxToRem(98)
};
let hintStyle = {
	lineHeight: pxToRem(98),
	bottom: "50%",
	top: "initial",
	transform: "translateY(50%)"
};
let underlineStyle = {
	bottom: 0
};
let underlineFocusStyle = {
	borderColor: "#00A3FE"
};

const VERIFYCODE_TIME = 30;
const areaCodeItems = [
	<MenuItem key={1} value={"+86"} primaryText={"+86"} />
];

const accountTypeItems = [
	<MenuItem key={1} value={"Demo"} primaryText={i18n['mobile.mock.account.key']} />,
	<MenuItem key={2} value={"Live"} primaryText={i18n['mobile.real.account.key']} />
];

export class SignupOpenAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false,
			disableVerfyCodeButton: false,
			showConfirmForm: false,
			time: i18n['signup.getverifycode'],
			isShowConfirmCard: false,
			disclaimer:''
		};
	}
	_onGetVerification = () => {
		let { fetchVerificationCode, phone } = this.props;
		if (!phone) {
			alert(i18n['forgetpwd.errormsg.mobile.requied']);
			return;
		}
		fetchVerificationCode(phone);
		let time = VERIFYCODE_TIME;
		this.setState({
			time: time,
			disableVerfyCodeButton: true
		});
		let timer = setInterval(() => {
			time--;
			if (time !== 0) {
				return this.setState({
					time: time
				});
			}
			this.setState({
				time: i18n['signup.getverifycode'],
				disableVerfyCodeButton: false
			});
			clearInterval(timer);
		}, 1000);
	}
	_getServerNames = () => {
		let { platforms } = this.props;
		let serverItems = [];
		platforms.forEach((value, index) => {
			let elem = <MenuItem key={index} value={value.vendor} primaryText={value.serverName} />;
			serverItems.push(elem)
		});
		return serverItems;
	}
	_getDemoAccountType = () => {
		let {
			selectedServer,
			platforms
		 } = this.props;
		let platform = null
		platforms.forEach((item) => { 
			if (item.vendor === selectedServer) { 
				platform = item
			}
		})
		let subTypes = platform && platform.demoAccountTypes || [];
		let subTypeItems = [];
		subTypes.forEach((value, index) => {
			let elem = <MenuItem key={index} value={value.typeId} primaryText={value.typeName} />;
			subTypeItems.push(elem)
		});
		return subTypeItems;
	}
	_onCheck = (evt, isChecked) => {
		this.setState({
			checked: isChecked
		});
	}
	_checkFormFields = () => {
		let {
			selectedServer,
			serverErrorText,
			selectedAccountType,
			demoAccountType,
			accountName,
			email,
			emailErrorText,
			selectedAreaCode,
			phone,
			verifyCode,
			loginPwd,
			repeatLoginPwd
		} = this.props;
		let result = true;
		let regEmail = /^[0-9a-zA-Z][\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]{0,}(\.[\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]+){0,}@[a-z0-9\-]{0,}(\.[a-z0-9\-]{2,6})*$/
		let regPhone = /^\d{11}$/g;
		let regPwd = /\S+/;
		if (!selectedServer) {
			result = false;
			this.props.updateServerErrorText(i18n['mobile.server.required']);
		} else {
			this.props.updateServerErrorText(null)
		}

		if (!selectedAccountType) {
			result = false;
			this.props.updateAccountTypeErrorText(i18n['fastSignup.choose.accounttype']);
		} else {
			this.props.updateAccountTypeErrorText(null)
		}

		if (selectedAccountType && selectedAccountType === 'Demo') {
			if (!demoAccountType) {
				result = false;
				this.props.updateDemoAccountTypeErrorText("请选择Demo账户类型");
			} else {
				this.props.updateDemoAccountTypeErrorText(null);
			}
		}

		if (!accountName) {
			result = false;
			this.props.updateAccountNameErrorText("请输入账户名");
		} else {
			this.props.updateAccountNameErrorText(null)
		}

		if (!regEmail.test(email)) {
			result = false;
			this.props.updateEmailErrorText("请正确填写邮箱");
		} else {
			this.props.updateEmailErrorText(null)
		}

		if (!selectedAreaCode) {
			result = false;
			this.props.updateAreaCodeErrorText("请选择区号")
		} else {
			this.props.updateAreaCodeErrorText(null)
		}

		if (!regPhone.test(phone)) {
			result = false;
			this.props.updatePhoneErrorText("请输入正确的手机号")
		} else {
			this.props.updatePhoneErrorText(null)
		}

		if (!verifyCode) {
			result = false;
			this.props.updateVerifyCodeErrorText('请输入验证码')
		} else {
			this.props.updateVerifyCodeErrorText(null)
		}

		if (!regPwd.test(loginPwd)) {
			result = false;
			this.props.updateLoginPwdErrorText("请输入密码")
		} else {
			this.props.updateLoginPwdErrorText(null)
		}

		if (!repeatLoginPwd) {
			result = false;
			this.props.updateRepeatLoginPwdErrorText("请输入密码")
		} else {
			if (repeatLoginPwd !== loginPwd) {
				result = false;
				this.props.updateRepeatLoginPwdErrorText("两次密码不一致")
			} else {
				this.props.updateRepeatLoginPwdErrorText(null)
			}
		}

		return result
	}

	_onTouchBinding = () => {
		// 检测表单数据
		if (!this.state.checked) {
			alert('请勾选风险提示选项');
			return;
		}

		let checkResult = this._checkFormFields();
		if (!checkResult) {
			return
		}
		// 展示确认页面
		this.setState({
			showConfirmForm: true
		});
	};

	_doValidate = (value, regExp) => {
		let result = true;
		if (regExp) {
			if (typeof regExp === 'function') {
				result = regExp(value);
			}
			else {
				result = regExp.test(value);
			}
		}
		return result;
	}
	_onAccountName = (evt, value) => {
		this.props.updateAccountName(value)
		if (!value) {
			this.props.updateAccountNameErrorText("请输入账户名");
		} else {
			this.props.updateAccountNameErrorText(null);
		}
	};
	_onEmail = (evt, value) => {
		let regEmail = /^[0-9a-zA-Z][\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]{0,}(\.[\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]+){0,}@[a-z0-9\-]{0,}(\.[a-z0-9\-]{2,6})*$/;
		this.props.updateEmail(value)
		if (!regEmail.test(value)) {
			this.props.updateEmailErrorText("请正确填写邮箱");
		} else {
			this.props.updateEmailErrorText(null);
		}
	};
	_onPhone = (evt, value) => {
		let regPhone = /^\d{5,11}$/g;
		this.props.updatePhone(value);
		if (!regPhone.test(value)) {
			this.props.updatePhoneErrorText("请输入正确的手机号");
		} else {
			this.props.updatePhoneErrorText(null);
		}
	};
	_onVerifyCode = (evt, value) => {
		let { updateVerifyCode } = this.props;
		updateVerifyCode(value)
		if (!value) {
			this.props.updateVerifyCodeErrorText('请输入验证码')
		} else {
			this.props.updateVerifyCodeErrorText(null)
		}
	}
	_onPassword = (evt, value) => {
		let regPwd = /\S+/;
		this.props.updateLoginPwd(value);
		if (!regPwd.test(value)) {
			this.props.updateLoginPwdErrorText("请输入密码");
		} else {
			this.props.updateLoginPwdErrorText(null);
		}
	};
	_onPassword2 = (evt, value) => {
		this.props.updateRepeatLoginPwd(value);
		if (!value) {
			this.props.updateRepeatLoginPwdErrorText("请输入密码")
		} else {
			if (value !== this.props.loginPwd) {
				this.props.updateRepeatLoginPwdErrorText("两次密码不一致")
			} else {
				this.props.updateRepeatLoginPwdErrorText(null)
			}
		}
	};
	_onServer = (evt, index, value) => {
		this.props.updateSelectedServer(value);
		if (!value) {
			this.props.updateServerErrorText("请选择服务器");
		} else {
			this.props.updateServerErrorText(null);
		}
	};
	_onAccountType = (evt, index, value) => {
		this.props.updateSelectedAccountType(value);
		setTimeout(function () {
			myScroll.refresh();
		}, 0);
		if (!value) {
			this.props.updateAccountTypeErrorText("请选择账户类型");
		} else {
			this.props.updateAccountTypeErrorText(null);
		}
	};
	_onDemoAccountType = (evt, index, value) => {
		this.props.updateSelectedDemoAccountType(value)
		if (!value) {
			this.props.updateDemoAccountTypeErrorText("请选择Demo账户类型");
		} else {
			this.props.updateDemoAccountTypeErrorText(null);
		}
	};
	_onAreaCode = (event, index, value) => {
		this.props.updateSelectedAreaCode(value)
		if (!value) {
			this.props.updateAreaCodeErrorText("请选择区号");
		} else {
			this.props.updateAreaCodeErrorText(null);
		}
	}
	_onOK = () => {
		let {
			openRealAccount,
			openDemoAccount,
			selectedServer,
			selectedAccountType,
			demoAccountType,
			accountName,
			email,
			phone,
			verifyCode,
			selectedAreaCode,
			loginPwd
		} = this.props;
		let { preSignUpKey } = window.GlobalVar;
		let data = {
			"vendor": selectedServer,// MT4|MT5
			"accountType": selectedAccountType,
			"email": email,
			"accountName": accountName,
			"phone": {
				"phone": phone,
				"countryCode": selectedAreaCode
			},
			"code": verifyCode,
			"password": loginPwd,
			"verifyPwd": loginPwd,
			"key": preSignUpKey
		};
		if (selectedAccountType === 'Demo') {
			data.demoAccountType = demoAccountType;
			openDemoAccount(data);
		}
		else {
			openRealAccount(data);
		}
		this.setState({
			showConfirmForm: false
		});
	}
	_onCancel = () => {
		this.setState({
			showConfirmForm: false
		});
	}
	_onCreateForms = () => {
		let {
			selectedServer,
			selectedAccountType,
			accountName,
			email,
			selectedAreaCode,
			phone
		} = this.props
		return [
			{
				name: '交易平台',
				value: selectedServer
			},
			{
				name: '账户类型',
				value: selectedAccountType === 'Live' ? '真实账户' : '测试账户'
			},
			{
				name: '姓名',
				value: accountName
			},
			{
				name: '邮箱',
				value: email
			},
			{
				name: '手机号',
				value: selectedAreaCode + phone
			}
		]
	}

	componentDidMount() {
		let {
			fetchPlatforms,
		} = this.props;
		fetchPlatforms();
	}

	loadDisclaimer = ()=>{
		let {fetchDisclaimer, selectedServer} = this.props;
		let vendor = selectedServer;
		fetchDisclaimer(vendor).then(res=>{
			this.setState({
				isShowConfirmCard: true,
				disclaimer: res.data
			});
		})
	}

	render() {
		let wStyle = {
			// boxShadow: "#C1DDFB 0px 1px 6px, #C1DDFB 0px 1px 4px",
			borderRadius: pxToRem(6)
		}
		let btnStyle = {
			// backgroundColor: "#00a3fe",
			height: pxToRem(88),
			lineHeight: pxToRem(88)
		};
		let overlayStyle = {
			height: pxToRem(88)
		};
		let verifyStyle = {
			position: "absolute",
			right: 0,
			top: pxToRem(11),
			height: pxToRem(66),
			lineHeight: pxToRem(66),
			color: "#00a3fe",
			border: pxToRem(1) + ' solid #00a3fe',
			borderRadius: pxToRem(8),
			zIndex: 100,
			marginLeft: pxToRem(40),
			textAlign: 'center'
		};
		let cardActions = [
			<RaisedButton primary={true} style={{ width: '100%' }}
				buttonStyle={{ backgroundColor: 'rgb(0, 163, 254)', height: pxToRem(90) }}
				label="知道了"
				onTouchTap={() => { 
					this.setState({isShowConfirmCard:false})
				 }} />
		];
		let {
			selectedServer,
			serverErrorText,
			selectedAccountType,
			accountTypeErrorText,
			demoAccountType,
			demoAccountTypeErrorText,
			accountName,
			accountNameErrorText,
			email,
			emailErrorText,
			selectedAreaCode,
			areaCodeErrorText,
			phone,
			phoneErrorText,
			verifyCode,
			verifyCodeErrorText,
			loginPwd,
			loginPwdErrorText,
			repeatLoginPwd,
			repeatLoginPwdErrorText
		} = this.props;
		let {disclaimer} = this.state;
		let {mobileLogo} = this.props.brand;
		return (
			<Page>
				<PageContent>
					<header className={css["header"]}>
						<img src={mobileLogo} className={css["logo"]}/>
						<span className={css["title"]}>
							{this.props.brand.siteName}
            </span>
					</header>
					<div className={css["content"]}>
						<div className={css["tip"]}>
							请认真填写以下信息，作为交易账户的信息凭证
            </div>
						<div className={css["wrapper"]}>
							<div className={css["form"]}>
								<IconSelectField iconSrc={serverIcon}
									fullWidth
									hintText={"请选择服务器"}
									height={pxToRem(98)}
									value={selectedServer}
									onChange={this._onServer}
									errorText={serverErrorText}
								>
									{this._getServerNames()}
								</IconSelectField>
								<IconSelectField iconSrc={accountTypeIcon}
									fullWidth
									hintText="请选择账户类型"
									height={pxToRem(98)}
									value={selectedAccountType}
									onChange={this._onAccountType}
									errorText={accountTypeErrorText}
								>
									{accountTypeItems}
								</IconSelectField>
								<IconSelectField iconSrc={accountTypeIcon}
									style={selectedAccountType === 'Demo' ? null : { display: "none" }}
									fullWidth
									hintText={"请选择Demo账户类型"}
									height={pxToRem(98)}
									value={demoAccountType}
									onChange={this._onDemoAccountType}
									errorText={demoAccountTypeErrorText}
								>
									{this._getDemoAccountType()}
								</IconSelectField>
								<IconTextField iconSrc={accountNameIcon}
									fullWidth
									errorText={accountNameErrorText}
									value={accountName}
									onChange={this._onAccountName}
									hintText={"请输入账户名"}
									style={textStyle}
									underlineStyle={underlineStyle}
									hintStyle={hintStyle}
									underlineFocusStyle={underlineFocusStyle} />
								<IconTextField iconSrc={emailIcon}
									fullWidth
									errorText={emailErrorText}
									value={email}
									onChange={this._onEmail}
									hintText={"请输入邮箱"}
									style={textStyle}
									underlineStyle={underlineStyle}
									hintStyle={hintStyle}
									underlineFocusStyle={underlineFocusStyle} />
								<IconSelectField iconSrc={areaCodeIcon}
									fullWidth
									value={selectedAreaCode}
									onChange={this._onAreaCode}
									height={pxToRem(98)}
									errorText={areaCodeErrorText}
								>
									{areaCodeItems}
								</IconSelectField>
								<IconTextField iconSrc={phoneIcon}
									fullWidth
									errorText={phoneErrorText}
									value={phone}
									onChange={this._onPhone}
									hintText={"请输入手机号"}
									style={textStyle}
									underlineStyle={underlineStyle}
									hintStyle={hintStyle}
									underlineFocusStyle={underlineFocusStyle} />
								<div className={css["verification"]}>
									<FlatButton label={this.state.time}
										style={verifyStyle}
										disabled={this.state.disableVerfyCodeButton}
										onTouchTap={this._onGetVerification} />
									<IconTextField iconSrc={verificationIcon}
										fullWidth
										value={verifyCode}
										errorText={verifyCodeErrorText}
										onChange={this._onVerifyCode}
										hintText={"请输入验证码"}
										style={textStyle}
										underlineStyle={underlineStyle}
										hintStyle={hintStyle}
										underlineFocusStyle={underlineFocusStyle} />
								</div>
								<IconTextField iconSrc={pwdIcon}
									fullWidth
									type="password"
									value={loginPwd}
									onChange={this._onPassword}
									hintText={"请输入登录密码"}
									errorText={loginPwdErrorText}
									style={textStyle}
									underlineStyle={underlineStyle}
									hintStyle={hintStyle}
									underlineFocusStyle={underlineFocusStyle} />
								<IconTextField iconSrc={pwd2Icon}
									fullWidth
									type="password"
									value={repeatLoginPwd}
									onChange={this._onPassword2}
									hintText={"请再次输入登录密码"}
									errorText={repeatLoginPwdErrorText}
									style={textStyle}
									underlineStyle={underlineStyle}
									hintStyle={hintStyle}
									underlineFocusStyle={underlineFocusStyle} />
							</div>
						</div>
						<div className={css["protocol"]}>
							<Agreements checked={this.state.checked}
								text={"我已阅读{{ITEM}}声明,并愿意继续开户"}
								items={[
									{
										text: '《用户协议及风险披露》',
										onTouchTap: () => {
											this.loadDisclaimer();
											
										}
									}
								]}
								onCheck={this._onCheck} />
						</div>
						<div className={css["binding"]}>
							<RaisedButton label="确认绑定"
								labelColor="#fff"
								backgroundColor="#00a3fe"
								buttonStyle={btnStyle}
								overlayStyle={overlayStyle}
								style={wStyle}
								onTouchTap={this._onTouchBinding}
								disabled={!this.state.checked}
								fullWidth={true} />
						</div>
					</div>
					<DisclaimerCard
						title="用户协议"
						show={this.state.isShowConfirmCard}
						actions={cardActions}>
						<div dangerouslySetInnerHTML={{__html: disclaimer}}></div>
					</DisclaimerCard>
					<FormConfirmation
						show={this.state.showConfirmForm}
						title={"请确认您的开户信息"}
						onOK={this._onOK}
						onCancel={this._onCancel}
						formFields={this._onCreateForms()}
					/>
				</PageContent>
			</Page>
		)
	}
}