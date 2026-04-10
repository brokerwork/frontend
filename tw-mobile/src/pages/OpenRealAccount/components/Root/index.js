// libs
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
// widgets
import { FullPageAvatarPaper } from 'widgets/FullPageAvatarPaper';
import { IconTextField } from 'widgets/IconTextField';
import { IconSelectField } from 'widgets/IconSelectField';
import { Agreements } from 'widgets/Agreements';
import { FormConfirmation } from 'widgets/FormConfirmation';
import { DisclaimerCard } from 'pages/Accounts/components/DisclaimerCard';
import AgreePopup from 'widgets/AgreePopup'

// utils
import { pxToRem } from 'utils/styleUtils';
import i18n from 'utils/i18n';
import { isEmail, isPhone } from 'utils/validator';
// enums
import { IsAppendAccount } from 'enums/isAppendAccount';
import FormFieldNames from '../../enums/formFieldNames';
// images
import iconServerDataURI from 'images/icon_server@3x.png';
import iconNameDataURI from 'images/icon_name@3x.png';
import iconEmailDataURI from 'images/icon_email@3x.png';
import iconAreaCodeDataURI from 'images/icon_area_code@3x.png';
import iconPhoneDataURI from 'images/icon_phone_number@3x.png';
import downIcon from 'images/icon_phoneDown.png';
// import iconRemarkDataURI from 'images/icon_edit@3x.png'

//  style
import css from "./index.less";
/* ----------------------- main --------------------------- */

const FORM_FIELD_HEIGHT = pxToRem(98)
const FORM_FIELD_ERROR_MSG = i18n['general.tips.required']

let style = {
	width: "100%",
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	maxHeight: pxToRem(100)
}

function getInvalidFormFieldNameArray(fieldNameEnum, props) {
	let resultArray = [];
	Object.keys(fieldNameEnum).forEach(enumName => {
		let fieldName = fieldNameEnum[enumName];
		let fieldValue = props[fieldName];
		if (!fieldValue || (typeof fieldValue === 'string' && !fieldValue.trim())) {
			resultArray.push(fieldName);
		}
	});
	return resultArray;
}

export default class OpenRealAccount extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			checked: false,
			isShowDisclaimer: false,
			countryCode: '86',
			isSubmit: false,			//	是否提交
		}
	}

	componentDidMount() {
		let {
      		resetForm,
			fetchServerName,
			fetchUserAccountProfile,
			routeParams,
			fetchDisclaimer,
			updateAccountName,
			updateEmail,
			updatePhone
    	} = this.props;
		resetForm();
		fetchServerName();
		fetchUserAccountProfile()
		// if (routeParams.isAppendAccount === IsAppendAccount.True) {
		// 	fetchUserAccountProfile();
		// } else { 
		// 	updateAccountName(accountName)
		// 	updateEmail(email)
		// 	updatePhone(phone)
		// }
	}

	onAccountNameChange = (event, newValue) => {
		this.props.updateAccountName(newValue)
	}

	onEmailChange = (event, newValue) => {
		this.props.updateEmail(newValue)
	}

	onPhoneChange = (event, newValue) => {
		this.props.updatePhone(newValue);
	}

	onServerNameChange = (event) => {
		let { updateServerName, serverNames } = this.props;
		let selectedServer = null
		serverNames.forEach((item) => { 
			if (item.vendor === event.target.value) { 
				selectedServer = item
			}
		})
		updateServerName(selectedServer)
	}

	onAgreementCheck = () => {
		this.props.toggleAgreementCheckedFlag();
	}

	//	提交
	onSubmit = () => {
		// let invalidFormFieldNameArray = getInvalidFormFieldNameArray(FormFieldNames, this.props);
		// if (invalidFormFieldNameArray.length > 0) {
		// 	this.props.markInvalidFormFields(invalidFormFieldNameArray);
		// } else {
		// 	this.props.showConfirmation();
		// }
		this.setState({
			isSubmit: true
		})
		let { accountName, email, selectedServer, phone, msgDialog } = this.props
		if (!selectedServer) {
			return msgDialog(i18n['mobile.server.required'])
		}
		if (!accountName || !email || !phone) return false
		if (!isEmail(email)) { 
			return msgDialog(i18n['fastSignup.email.invalid'])
		}
		if (!isPhone(phone)) { 
			return msgDialog(i18n['fastSignup.phone.invalid'])
		}
		this.props.showConfirmation()
	}

	onConfirmationCanel = () => {
		this.props.hideConfirmation();
	}

	onConfirmationOK = () => {
		let {
      		accountName,
			email,
			phone,
			selectedServer,
			routeParams
    	} = this.props;

		let isSameNameAccount = false
		if (routeParams.isAppendAccount === IsAppendAccount.True){ 
			isSameNameAccount = true
		}
		this.props.submitOpenAccountRequest({
			vendor: selectedServer.vendor,
			email,
			accountName,
			phone: {
				phone: phone,
				countryCode: `+${this.state.countryCode}`,
			},
			isSameNameAccount: isSameNameAccount
		}).then((res) => {
			if (res && res.payload && res.payload.result) {
				if (window.location.href.indexOf('fromApp') != -1) {
					window.postMessage(JSON.stringify({ result: true }), '*')
				} else {
					this.props.router.push('/accounts/open/real/success')
				}
			} else {
				if (window.location.href.indexOf('fromApp') != -1) {
					window.postMessage(JSON.stringify({ result: false }), '*')
				}
			}
			}, (err) => { 
				if (window.location.href.indexOf('fromApp') != -1) {
					window.postMessage(JSON.stringify({ result: false }), '*')
				}
			})
	}

	renderServerNames() {
		let { serverNames } = this.props;
		return serverNames.map(o => {
			return (
				<MenuItem
					key={o.vendor}
					value={o.vendor}
					primaryText={o.serverName}
				/>
			);
		})
	}

	createConfirmationFormFields() {
		let {
      		selectedServer,
			accountName,
			email,
			phone
    	} = this.props;

		return [
			{
				name: i18n['bindaccount.server'],
				value: selectedServer && selectedServer.serverName
			}, {
				name: i18n['mobile.account.name.key'],
				value: accountName
			},
			{
				name: i18n['menu.email'],
				value: email
			}, {
				name: i18n['tausermgmt.phone'],
				value: `+${this.state.countryCode} ` + phone
			}
		];
	}

	_loadDisclaimer = () => {
		let { commonDisclaimer, selectedServer, msgDialog } = this.props;
		let vendor;
		if (selectedServer != null) {
			vendor = selectedServer.vendor;
		}
		if (!vendor){ 
			return msgDialog(i18n['mobile.server.required'])
		}
		commonDisclaimer(vendor).then(res => {
			if (res.payload.result){ 
                this.setState({
                    disclaimer: res.payload.data,
                    isShowDisclaimer: true
                })
            }
		});

	}
	//  关闭用户协议
    closePopup = () => { 
        this.setState({
            isShowDisclaimer: false
        })
	}
	//	手机前缀
	countryPhoneChange = (event) => { 
		this.setState({
			countryCode: event.target.value
		})
	}
	render() {
		let {
      		accountName,
			email,
			hasEmail,
			phone,
			selectedServer,
			agreementChecked,
			confirmationShown,
			routeParams,
			serverNames,
			countryPhone,
		} = this.props;
		let { disclaimer, isShowDisclaimer, isSubmit } = this.state;
		let isAppendAccount = routeParams.isAppendAccount === IsAppendAccount.True;
		let serverMT4 = {}
		serverNames && serverNames.length && serverNames.forEach((item) => { 
			if (item.vendor == 'MT4') { 
				serverMT4 = item
			}
		})
		return (
			<FullPageAvatarPaper
				avatarSrc={this.props.brand.mobileLogo}
				headText={i18n['mobile.check.send.email']}
			>
				<div className={css['open-real-container']} style={{ marginTop: pxToRem(38) }}>
					<div className={css['select-vendor']}>
						<img src={iconServerDataURI} className={css['server-prefix']}/>
						<select
							style={selectedServer && selectedServer.vendor ? { color: 'rgba(0,0,0,0.87)' } : {color: 'rgba(0,0,0,0.3)'}}	
							value={selectedServer ? selectedServer.vendor : ''}
							onChange={this.onServerNameChange}>
							<option value='' disabled style={{ display: 'none' }}>{i18n['mobile.server.required']}</option>
							{
								window.location.href.indexOf('fromApp') != -1 ?
									<option value={serverMT4.vendor}>{serverMT4.serverName}</option>
									: 
									serverNames && serverNames.length && serverNames.map((item, index) => { 
										return <option key={index} value={item.vendor}>{item.serverName}</option>
									})
							}
							
						</select>
						<img src={downIcon} className={css['down-icon']}/>
					</div>
					<IconTextField
						fullWidth
						hintText={i18n['mobile.account.name.key']}
						style={style}
						height={FORM_FIELD_HEIGHT}
						iconSrc={iconNameDataURI}
						disabled={isAppendAccount}
						errorText={ isSubmit && !accountName && FORM_FIELD_ERROR_MSG}
						value={accountName || ''}
						onChange={this.onAccountNameChange}
					/>
					<IconTextField
						fullWidth
						hintText={i18n['menu.email']}
						style={style}
						iconSrc={iconEmailDataURI}
						height={FORM_FIELD_HEIGHT}
						disabled={isAppendAccount}
						errorText={ isSubmit && !email && FORM_FIELD_ERROR_MSG}
						value={email || ''}
						onChange={this.onEmailChange}
					/>
					<div className={css['country-phone']}>
						<img src={iconAreaCodeDataURI} className={css['server-prefix']}/>	
						<select
							value={this.state.countryCode || '86'}
							onChange={this.countryPhoneChange}>
							{
								countryPhone && countryPhone.length ? countryPhone.map((item, index) => {
									return <option key={index} value={item.value} >+{item.value}</option>	
								}) : <option value="86">+86</option>
							}
						</select>	
						<img src={downIcon} className={css['down-icon']}/>	
					</div>
					<IconTextField
						fullWidth
						hintText={i18n['tausermgmt.phone']}
						style={style}
						iconSrc={iconPhoneDataURI}
						height={FORM_FIELD_HEIGHT}
						disabled={isAppendAccount}
						errorText={isSubmit && !phone && FORM_FIELD_ERROR_MSG}
						value={phone || ''}
						onChange={this.onPhoneChange}
					/>
					<div style={{ marginTop: pxToRem(32) }} className={css["required"]}>
						<Agreements
							checked={agreementChecked}
							text={`${i18n['mobile.already']}{{ITEM}}${i18n['mobile.statement']}。`}
							items={[{
								text: `《${i18n['openaccount.protocol2']}》`,
								onTouchTap: () => {
									//this.setState({isShowDisclaimer: true})
									this._loadDisclaimer();
								}
							}]}
							onCheck={this.onAgreementCheck}
						/>

					</div>
					<RaisedButton
						style={{ display: 'block', width: '100%', margin: pxToRem(110) + ' auto 0 auto' }}
						buttonStyle={{ height: pxToRem(88), lineHeight: pxToRem(88) }}
						overlayStyle={{ height: pxToRem(88), lineHeight: pxToRem(88) }}
						label={i18n['general.submit.tw']}
						primary
						disabled={!agreementChecked}
						onTouchTap={this.onSubmit}
					/>
					<AgreePopup
						title={i18n['mobile.user.deal']}
						onClose={this.closePopup}
						show={this.state.isShowDisclaimer}>
						<div dangerouslySetInnerHTML={{ __html: this.state.disclaimer }}></div>
					</AgreePopup>
					<FormConfirmation
						title={i18n['mobile.confirm.open.key']}
						show={confirmationShown}
						formFields={this.createConfirmationFormFields()}
						onCancel={this.onConfirmationCanel}
						onOK={this.onConfirmationOK}
					/>
				</div>
			</FullPageAvatarPaper>
		);
	}
}