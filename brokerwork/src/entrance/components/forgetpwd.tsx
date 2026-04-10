// libs
import * as React from 'react';
import {
	Button,
	DropdownButton, MenuItem, CustomDateRangePicker, ButtonGroup, NewSelect
} from 'fooui';
import { HttpClient } from '../../http/httpclient';
import {
	Form, FormGroup,
	FormControl, Dropdown, ControlLabel, Grid, Row,
	Col, Clearfix, Panel, PanelGroup, Accordion, Glyphicon
} from 'react-bootstrap';
import * as classnames from 'classnames';
import * as ReactDOM from 'react-dom';
import { I18nLoader } from '../../i18n/loader';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
/* ------------------- main start ---------------------- */
interface P {

}
interface S {
	value: string,
	login: string,
	emailplaceholder: string,
	getemailcheck: string,
	errorTints: string,
	oldemailplaceholder: string,
	newemailplaceholder: string,
	sendsuccess: string,
	sendfail: string,
	issendsuccess: string,
	showstate: string,
	disabled: string

}

class ForgetPwd extends React.Component<P, S> {
	constructor(props: P) {
		super(props);
		this.state = {
			value: "",
			login: I18nLoader.get('login.forget_pwd.login'),
			emailplaceholder: I18nLoader.get('login.forget_pwd.email_placeholder'),
			getemailcheck: I18nLoader.get('login.forget_pwd.send_email'),
			errorTints: I18nLoader.get('login.forget_pwd.error_message'),
			oldemailplaceholder: I18nLoader.get('login.forget_pwd.new_pwd'),
			newemailplaceholder: I18nLoader.get('login.forget_pwd.confirm_pwd'),
			sendsuccess: I18nLoader.get('login.forget_pwd.send_success'),
			sendfail: I18nLoader.get('login.forget_pwd.send_fail'),
			issendsuccess: { display: "none" },
			showstate: "",
			disabled: ""

		}
	}

	handleChange = (e) => {
		this.setState({ value: e.target.value });
	}

	checkmail = () => {
		let mail = document.getElementById("oldEmail").value;
		HttpClient.doPost('/v1/user/forget/password/' + mail + "/mail")
			.then((res) => {
				if (res.result) {
					this.setState({ showstate: "sendsuccess" });
					this.setState({ issendsuccess: { display: 'block' } });
					this.setState({ disabled: 'disabled' });
					setTimeout(function () {
						window.location.href = window.location.href = "/login";
					}, 3000)

				} else {
					this.setState({ showstate: "sendfail" });
					this.setState({ issendsuccess: { display: 'block' } });
					this.setState({ sendsuccess: I18nLoader.getErrorText(res.mcode) });
				}
			})
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
			<div id="forget">
				<div className="wholePage">
					<div className="loginPanelMark">
						<form className="loginPanel">
							<div className="loginHeader" id="findpwdStep1">
								<div className="findpwd">{I18nLoader.get('login.forget_pwd.find_pwd')}</div>
								<div className="languange-choice">
									<NewSelect
										ref="language"
										options={languages}
										btnText={currentLanguage.label} 
										className="header-lang header-menu"
										imgSrc={`http://broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country/${currentLanguage.icon}`}
										iconRight="fa fa-angle-down"
										isChangeText={true}
										onChange={this.changeLanguage}
									/>
								</div>
							</div>
							<div className="loginContent">
								<FormGroup>
									<div className='errorTints' style={this.state.issendsuccess}><p>{this.state.sendsuccess}</p></div>
									<FormControl className="input-height" id="oldEmail" value={this.state.value} type="text" onChange={this.handleChange} placeholder={this.state.emailplaceholder} />
									<FormControl.Feedback />
								</FormGroup>
								<Button bsStyle="primary" style={{ width: "99%" }} bsSize="large" block disabled={this.state.disabled} id="checkemail" onClick={this.checkmail}>{this.state.getemailcheck}</Button>
								<Button className="registerBtn" style={{ width: "99%" }} bsSize="large" block><Link to="entrance" className="remember-pwd">{this.state.login}</Link></Button>
							</div>
							<div className="beautifulBlank"></div>
						</form>

					</div>
				</div>

			</div>
		)
	}
}

export { ForgetPwd };
