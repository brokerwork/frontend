import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { FullPageAvatarPaper } from 'widgets/FullPageAvatarPaper';
import { IconTextField } from 'widgets/IconTextField';
import { IconSelectField } from 'widgets/IconSelectField';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import i18n from 'utils/i18n';

import iconServerDataUrl from 'images/icon_server@3x.png';
import iconNameDataUrl from 'images/icon_name@3x.png';
import iconEmailDataUrl from 'images/icon_email@3x.png';
import iconTypeDataUrl from 'images/icon_type@3x.png';
import downIcon from 'images/icon_phoneDown.png';
// import platformAvatarDataUrl from 'images/leanwork_logo@3x.png';
import { SnackBar } from 'widgets/Snackbar';
import css from './index.less'

const FORM_FIELD_HEIGHT = pxToRem(98);

let style = {
	width: "100%",
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	maxHeight: pxToRem(100)
}
export default class OpenMockAccount extends React.PureComponent {
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		let { fetchOpenAccountsInfo, openMockAccount } = this.props;
		fetchOpenAccountsInfo();
	}

	_resetErrorTexts = () => {
		//reset errors
		let { setFieldErrorText } = this.props;
		setFieldErrorText('serverNamesValidateErrorText', '')
		setFieldErrorText('accountNameValidateErrorText', '')
		setFieldErrorText('emailValidateErrorText', '')
		setFieldErrorText('accountTypesValidateErrorText', '')
	}
	_validateFields = () => {
		let result = true;
		let {
      selectedServer,
			accountName,
			email,
			selectedAccountType,
			setFieldErrorText
    } = this.props;

		this._resetErrorTexts();

		if (selectedServer.vendor.length == 0) {
			result = false;
			setFieldErrorText('serverNamesValidateErrorText', i18n['mobile.server.required'])
		}
		if (accountName.length == 0) {
			result = false;
			setFieldErrorText('accountNameValidateErrorText', i18n['mobile.account.required'])
		}

		let regEmail = /^[0-9a-zA-Z][\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]{0,}(\.[\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]+){0,}@[a-z0-9\-]{0,}(\.[a-z0-9\-]{2,6})*$/;
		if (!regEmail.test(email)) {
			result = false;
			setFieldErrorText('emailValidateErrorText', i18n['fastSignup.email.invalid'])
		}
		if (selectedAccountType.typeId.length == 0) {
			result = false;
			setFieldErrorText('accountTypesValidateErrorText', i18n['fastSignup.accountType.required'])
		}
		return result
	}
	_doSubmit = () => {
		let {
      		openMockAccount,
			selectedServer,
			accountName,
			email,
			selectedAccountType
    } = this.props;

		if (!this._validateFields()) {
			return;
		}
		openMockAccount({
			vendor: selectedServer.vendor,
			accountName,
			email,
			demoAccountType: selectedAccountType.typeId
		}).then((res) => {
			if (res && res.payload && res.payload.result) {
				if (window.location.href.indexOf('fromApp') != -1) {
					window.postMessage(JSON.stringify({ result: true }), '*')
				} else { 
					this.props.router.push('/accounts/open/mock/success')
				}
			} else { 
				if (window.location.href.indexOf('fromApp') != -1) {
					window.postMessage(JSON.stringify({ result: false }), '*')
				}
			}
		}).catch((err) => { 
			if (window.location.href.indexOf('fromApp') != -1) {
				window.postMessage(JSON.stringify({ result: false }), '*')
			}
		})
	}

	_onServerNameChange = (event) => {
		let {
			updateServerName,
			serverNames,
			setFieldErrorText,
			updateAccountType
		} = this.props;
		setFieldErrorText('serverNamesValidateErrorText', '')
		let selectedServer = null
		serverNames.forEach((item) => { 
			if (item.vendor === event.target.value) { 
				selectedServer = item
			}
		})
		updateServerName(selectedServer)
		updateAccountType({ typeId: '', typeName: '' })
	}
	_onAccountTypeChange = (event) => {
		let { updateAccountType, serverData, selectedServer, setFieldErrorText } = this.props;
		setFieldErrorText('accountTypesValidateErrorText', '')
		let selectName
		serverData.forEach((item) => { 
			if (item.serverName == selectedServer.serverName){ 
				selectName = item.demoAccountTypes
			}
		})
		let selectedAccountType = null
		selectName.forEach((item) => { 
			if (item.typeId === event.target.value) { 
				selectedAccountType = item
			}
		})
		updateAccountType(selectedAccountType)
	}
	_onAccountNameChange = (event, newValue) => {
		let { updateAccountName, setFieldErrorText } = this.props;
		setFieldErrorText('accountNameValidateErrorText', '')
		updateAccountName(newValue)
	}
	_onEmailChange = (event, newValue) => {
		let { updateEmail, setFieldErrorText } = this.props;
		setFieldErrorText('emailValidateErrorText', '')
		updateEmail(newValue)
	}
	_renderAccountTypes = () => {
		const { serverData, selectedServer } = this.props;
		let selectName
		serverData.forEach((item) => { 
			if (item.serverName == selectedServer.serverName){ 
				selectName = item.demoAccountTypes
			}
		})
		// return selectName && selectName.map(o => {
		// 	return <MenuItem key={o.typeId} value={o.typeId} primaryText={o.typeName} />
		// })
		return selectName && selectName.map((item, index) => { 
			return <option key={index} value={item.typeId}>{item.typeName}</option>
		})
	}
	_renderServerNames = () => {
		let { serverNames } = this.props;
		return serverNames.map(o => {
			return <MenuItem key={o.vendor} value={o.vendor} primaryText={o.serverName} />
		})
	}
	render() {
		let {
      		serverNames,
			serverNamesValidateErrorText,
			selectedServer,
			accountTypes,
			accountTypesValidateErrorText,
			selectedAccountType,
			accountName,
			accountNameValidateErrorText,
			email,
			emailValidateErrorText,
			structuralList,
    	} = this.props;
		let { mobileLogo } = this.props.brand;
		let serverMT4 = {}
		let structural_list = JSON.parse(window.localStorage.getItem('LIST'))
		if (!structuralList || structuralList.length <= 0) { 
			structuralList = structural_list
		}
		let visibleMT4 = false
		let visibleMT5 = false
		if (structuralList && structuralList.length) {
			structuralList.forEach((item) => {
				if (item.structural=='MT4' && item.basicSetting.allowDemoAccount) {
					visibleMT4 = true
				}
				if (item.structural=='MT5' && item.basicSetting.allowDemoAccount){ 
					visibleMT5 = true			
				}
			})
		}
		let visibleServerNames = []
		serverNames && serverNames.length && serverNames.forEach((item) => { 
			if (item.vendor == 'MT4') { 
				serverMT4 = item
			}
			if (item.vendor == 'MT4' && visibleMT4) { 
				visibleServerNames.push(item)
			}
			if (item.vendor == 'MT5' && visibleMT5) { 
				visibleServerNames.push(item)
			}
		})
		return (
			<FullPageAvatarPaper
				avatarSrc={mobileLogo}
				headText={i18n['mobile.check.send.email']}
			>
				{/*<SnackBar open={true} message="abc"/>*/}
				<div className={css['open-mock-container']} style={{ marginTop: pxToRem(38) }}>
					{/* <IconSelectField
						errorText={serverNamesValidateErrorText}
						fullWidth
						hintText={i18n['mobile.server.required']}
						height={FORM_FIELD_HEIGHT}
						value={selectedServer && selectedServer.vendor}
						iconSrc={iconServerDataUrl}
						onChange={this._onServerNameChange}
					>
						{this._renderServerNames()}
					</IconSelectField> */}
					<div className={css['select-vendor']}>
						<img src={iconServerDataUrl} className={css['server-prefix']}/>
						<select
							style={selectedServer && selectedServer.vendor ? { color: 'rgba(0,0,0,0.87)' } : {color: 'rgba(0,0,0,0.3)'}}	
							value={selectedServer ? selectedServer.vendor : ''}
							onChange={this._onServerNameChange}>
							<option value='' disabled style={{display: 'none'}}>{i18n['mobile.server.required']}</option>
							{
								window.location.href.indexOf('fromApp') != -1 ?
									<option value={serverMT4.vendor}>{serverMT4.serverName}</option>
									:
									visibleServerNames && visibleServerNames.length && visibleServerNames.map((item, index) => { 
										return <option key={index} value={item.vendor}>{item.serverName}</option>
									})
							}
						</select>
						<img src={downIcon} className={css['down-icon']}/>
					</div>
					<IconTextField
						errorText={accountNameValidateErrorText}
						fullWidth
						hintText={i18n['mobile.account.name.key']}
						style={style}
						value={accountName}
						onChange={this._onAccountNameChange}
						height={FORM_FIELD_HEIGHT}
						iconSrc={iconNameDataUrl}
					/>
					<IconTextField
						errorText={emailValidateErrorText}
						fullWidth
						value={email}
						hintText={i18n['menu.email']}
						style={style}
						iconSrc={iconEmailDataUrl}
						height={FORM_FIELD_HEIGHT}
						onChange={this._onEmailChange}
					/>
					{/* <IconSelectField
						errorText={accountTypesValidateErrorText}
						fullWidth
						hintText={i18n['fastSignup.choose.accounttype']}
						height={FORM_FIELD_HEIGHT}
						value={selectedAccountType.typeId}
						iconSrc={iconTypeDataUrl}
						height={FORM_FIELD_HEIGHT}
						onChange={this._onAccountTypeChange}
					>
						{this._renderAccountTypes()}
					</IconSelectField> */}
					<div className={css['account-type']}>
						<img src={iconTypeDataUrl} className={css['server-prefix']}/>	
						<select
							style={selectedAccountType.typeId ? { color: 'rgba(0,0,0,0.87)' } : {color: 'rgba(0,0,0,0.3)'}}		
							value={selectedAccountType.typeId || ''}
							onChange={this._onAccountTypeChange}>
							<option value='' disabled style={{display: 'none'}}>{i18n['fastSignup.choose.accounttype']}</option>
							{this._renderAccountTypes()}
						</select>	
						<img src={downIcon} className={css['down-icon']}/>
					</div>
					<RaisedButton
						style={{ display: 'block', width: '100%', margin: pxToRem(50) + ' auto 0 auto' }}
						buttonStyle={{ height: pxToRem(88), lineHeight: pxToRem(88), backgroundColor: '#00a3fe' }}
						overlayStyle={{ height: pxToRem(88), lineHeight: pxToRem(88) }}
						label={i18n['general.submit.tw']}
						primary={true}
						onTouchTap={this._doSubmit}
					/>
				</div>
			</FullPageAvatarPaper>
		);
	}
} 