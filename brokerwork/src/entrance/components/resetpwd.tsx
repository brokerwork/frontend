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
	errorTints: string,
	oldemailplaceholder: string,
	newemailplaceholder: string,
	nextstep: string
}

class ResetPwd extends React.Component<P, S> {
	constructor(props: P) {
		super(props);
		this.state = {
			value: "",
			login: I18nLoader.get('login.reset_password.login'),
			errorTints: I18nLoader.get('login.reset_password.error_message'),
			oldemailplaceholder: I18nLoader.get('login.reset_password.new_pwd'),
			newemailplaceholder: I18nLoader.get('login.reset_password.confirm_pwd'),
			nextstep: I18nLoader.get('login.reset_password.next_step')
		}
	}

	getValidationState() {
		const length = this.state.value.length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
	}

	resetpwd = () => {
		let defaultparam = "";
		HttpClient.doPost('/v1/user/pwd/modify', defaultparam)
			.then((res) => {
				if (res.result) {

				} else {
					alert(I18nLoader.get('login.reset_password.reset_fail'));
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
							<div className="loginHeader">
								<div className="findpwd">{I18nLoader.get('login.reset_password.reset_pwd')}</div>
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
								<ControlLabel className="errorTints">{this.state.errorTints}</ControlLabel>
								<FormGroup controlId="newPwd" validationState={this.getValidationState()}>
									<FormControl id="newPwd" type="text" placeholder={this.state.oldemailplaceholder} />
									<FormControl.Feedback />
								</FormGroup>
								<FormGroup controlId="oldPwd" validationState={this.getValidationState()}>
									<FormControl id="oldPwd" type="text" placeholder={this.state.newemailplaceholder} />
									<FormControl.Feedback />
								</FormGroup>
								<Button bsStyle="primary" style={{ width: "99%" }} bsSize="large" block id="resetemail">{this.state.nextstep}</Button>
								<Button className="registerBtn" style={{ width: "99%" }} onClick={this.resetpwd} bsSize="large" block><Link to="entrance">{this.state.login}</Link></Button>
							</div>
							<div className="beautifulBlank"></div>
						</form>

					</div>
				</div>

			</div>
		)
	}
}

export { ResetPwd };
